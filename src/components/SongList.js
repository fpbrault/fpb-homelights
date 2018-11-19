import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Chip from '@material-ui/core/Chip'
import Icon from '@material-ui/core/Icon'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Zoom from '@material-ui/core/Zoom'
import Switch from '@material-ui/core/Switch'
import Button from '@material-ui/core/Button'

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    paddingTop: 0,
    paddingBottom: 0,
    justifyContent: 'flex-end'
  },
  chip: {
    margin: 0,
    padding: 0,
    textAlign: 'right',
    paddingBottom: 0
  },
  ListItem: {
    margin: 0,
    paddingTop: 0,
    textAlign: 'right',
    justifyContent: 'flex-end'
  },
  List: {
    margin: 0,
    paddingTop: 0,
    textAlign: 'right',
    paddingBottom: 0
  },
  wrapper: {
    maxWidth: 600
  }
})

const API =
  'https://cors.io/?https://api.streamersonglist.com/api/streamers/lady_orange/'
const DEFAULT_QUERY = 'queues?inactive=false'

class SongList extends Component {
  constructor (props) {
    super(props)

    this.state = {
      queue: [],
      queueorder: [],
      checked: false
    }
  }

  handleChange = () => {
    this.forceUpdate()
    this.setState(state => ({ checked: !state.checked }))
  }

  handleUpdate = () => {
    this.callApi()
      .then(res =>
        this.setState({
          queue: res.queue,
          queueorder: res.queuePosition
        })
      )
      .then(console.log(this))
      .catch(err => console.log(err))
    this.forceUpdate()
  }

  handleDelete = data => () => {
    if (data.label === 'React') {
      alert('Why would you want to delete React?! :)') // eslint-disable-line no-alert
      return
    }

    this.setState(state => {
      const chipData = [...state.chipData]
      const chipToDelete = chipData.indexOf(data)
      chipData.splice(chipToDelete, 1)
      return { chipData }
    })
  }

  componentDidMount () {
    this.callApi()
      .then(res =>
        this.setState({
          queue: res.queue,
          queueorder: res.queuePosition
        })
      )
      .then(console.log(this))
      .catch(err => console.log(err))
  }

  callApi = async () => {
    const response = await fetch(API + DEFAULT_QUERY, {
      method: 'GET',
      headers: { Accept: 'application/json' }
    })
    const body = await response.json()

    if (response.status !== 200) throw Error(body.message)

    return body
  }

  render () {
    const { classes } = this.props
    this.state.queueorder.map(data => {
      // console.log(data.queueId)
      // console.log(this.state.queue)
      let result = this.state.queue.filter(obj => {
        return obj.id === data.queueId
      })
      // console.log(result)
    })
    const { checked } = this.state
    return (
      <div className={classes.root}>
        <Button onClick={this.handleUpdate}>Open Modal</Button>

        <Switch
          checked={checked}
          onChange={this.handleChange}
          aria-label='Collapse'
        />
        <div className={classes.wrapper}>

          <List component='nav' className={classes.List}>
            {this.state.queueorder.map(data => {
              let icon = null
              let song = null
              let color = null
              // console.log(data)

              let result = this.state.queue.filter(obj => {
                return obj.id === data.queueId
              })
              console.log(data.position)
              // console.log(result)
              if (result[0].songArtist !== '') {
                song = result[0].songName + ' — ' + result[0].songArtist
                color = ''
              }
              if (result[0].donationAmount > '0.00') {
                icon = <Icon>attach_money</Icon>
                color = 'secondary'
              }
              if (result[0].songArtist === '') {
                icon = <Icon color='secondary'>star-circle</Icon>
                song = result[0].songName
                color = 'primary'
              }

              var delay = data.position * 500
              console.log(delay)
              return (
                <Zoom
                  in={checked}
                  style={{
                    transitionDelay: data.position * 200
                  }}
                >
                  <ListItem className={classes.ListItem}>
                    <Chip
                      color={color}
                      key={result[0].id}
                      icon={icon}
                      label={song}
                      className={classes.chip}
                    />
                  </ListItem>
                </Zoom>
              )
            })}
          </List>
        </div>
      </div>
    )
  }
}

SongList.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(SongList)
