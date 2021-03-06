import React, { Component } from 'react'
import { connect } from 'react-redux'

import RaisedButton from 'material-ui/RaisedButton'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ImageEdit from 'material-ui/svg-icons/image/edit'
import ImageAdd from 'material-ui/svg-icons/content/add'
import ImageDelete from 'material-ui/svg-icons/action/delete'
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import {Tabs, Tab} from 'material-ui/Tabs'
import {Card} from 'material-ui/Card'
import SwipeableViews from 'react-swipeable-views'
import Snackbar from 'material-ui/Snackbar'

import { fetchContents, updateMessage } from './actions'

const mapStateToProps = ({page, message}) => ({
  page,
  message,
})

class MessageEditor extends Component {
  constructor(props, context) {
    super(props, context)
    const { message } = this.props
    this.state = {
      isOpenDialog: false,
      isOpenSnackbar: false,
      snackbarMessage: "",
      slideIndex: 0,
      message: message,
      defaultMessage: {
        description: [
          {id: 0, text: "あなたは2人で旅行をしていたところ、浮浪罪で逮捕された。\nあなたたちは共犯をして強盗を働いたのではないと疑われているが、有罪にするには証拠が不十分である。"},
          {id: 1, text: "地方検事は隔離された独房で個別に彼らを審問し、各々に対して次のような提示をした。"},
          {id: 2, text: "「もし君が自白して君の友人が自白しなかったら、君は釈放されるが友人は厳しく処罰されるだろう。\nもし2人とも自白すれば判決は控えめになるだろう。\nもし誰も自白しなければ、軽い浮浪罪で処罰されるだろう。」"},
          {id: 3, text: "ここで約束された懲役は次の表に月単位で示される。\nもしも合理的ならば彼らはどのような行動を選ぶだろうか。"},
        ],
        experiment: "",
      },
    }
  }

  ExperimentTab() {
    return (
      <div>
        <p>実験画面に表示するメッセージ</p>
        <TextField
          hintText={"メッセージ"}
          defaultValue={this.state.message.experiment}
          onBlur={this.handleChange.bind(this, ["waiting"])}
          multiLine={true}
          fullWidth={true}
        />
      </div>
    )
  }

  DescriptionTab() {
    return (
      <div>
        <table>
          <tbody>
            {
              this.state.message.description.map((message, index) => (
                <tr key={message.id}>
                  <td>
                    <FloatingActionButton 
                      mini={true}
                      secondary={true}
                      onClick={this.deleteDescription.bind(this, index)}
                      disabled={this.state.message.description.length <= 1}
                    >
                      <ImageDelete />
                    </FloatingActionButton>
                  </td>
                  <td>
                    <TextField
                      hintText={"問題の説明"}
                      defaultValue={message.text}
                      onBlur={this.handleChange.bind(this, ["description", index, "text"])}
                      multiLine={true}
                      fullWidth={true}
                    />
                  </td>
                </tr>
              ))
            }
            <tr>
              <td>
                <FloatingActionButton 
                  mini={true}
                  secondary={true}
                  disabled={true}
                >
                  <ImageDelete />
                </FloatingActionButton>
              </td>
              <td>
                利得表
              </td>
            </tr>
            <tr>
              <td>
                <FloatingActionButton 
                  mini={true}
                  secondary={true}
                  disabled={true}
                >
                  <ImageDelete />
                </FloatingActionButton>
              </td>
              <td>
                待機画面
              </td>
            </tr>

            <tr>
              <td>
                <FloatingActionButton 
                  mini={true}
                  onClick={this.addDescription.bind(this)}
                >
              <ImageAdd />
            </FloatingActionButton>
          </td>
        </tr>
          </tbody>
        </table>
      </div>
    )
  }

  handleOpen() {
    const { dispatch } = this.props
    dispatch(fetchContents())
    this.setState({ 
      message: this.props.message,
      isOpenDialog: true,
      slideIndex: 0,
    })
  }

  handleClose() {
    this.setState({ 
      message: this.props.message,
      isOpenDialog: false 
    })
  }

  handleChange(value, event) {
    var message = Object.assign({}, this.state.message)
    var temp = message
    for (var i = 0; i < value.length - 1; i++) {
      temp = temp[value[i]]
    }
    temp[value[value.length - 1]] = event.target.value
    this.setState({ message: message })
  }

  handleRequestClose() {
    this.setState({
      isOpenSnackbar: false,
    })
  }

  handleSlideIndex(value) {
    this.setState({
      slideIndex: value,
    })
  }

  deleteDescription(index) {
    var { message } = this.state
    message.description.splice(index, 1)
    this.setState({
      message: message,
    })
  }

  addDescription() {
    var { message } = this.state
    var id = 0
    var flag = false
    while (!flag) {
      for (var i = 0; i < message.description.length; i++) {
        if (message.description[i].id == id) {
          id++
          break
        } else if (i >= message.description.length-1) {
          flag = true
        }
      }
    }
        
    message.description.push({id: id, text: ""})
    this.setState({
      message: message,
    })
  }

  submit() {
    this.setState({ 
      isOpenDialog: false,
      isOpenSnackbar: true,
      snackbarMessage: "メッセージを送信しました",
    })
    const { dispatch } = this.props
    dispatch(updateMessage(this.state.message))
  }

  reset() {
    this.setState({
      isOpenDialog: false,
      isOpenSnackbar: true,
      snackbarMessage: "メッセージを初期化しました",
    })
    const { dispatch } = this.props
    dispatch(updateMessage(this.state.defaultMessage))
  }


  render() {
    const { page } = this.props
    const actions = [
      <RaisedButton
        label="適用"
        primary={true}
        keyboardFocused={true}
        onClick={this.submit.bind(this)}
      />,
      <RaisedButton
        label="キャンセル"
        onClick={this.handleClose.bind(this)}
      />,
      <RaisedButton
        label="初期化"
        onClick={this.reset.bind(this)}
      />,
    ]
    return (
      <span>
        <FloatingActionButton
          style={{marginLeft: '2%'}}
          onClick={this.handleOpen.bind(this)}
          disabled={page != "waiting"}
        >
          <ImageEdit />
        </FloatingActionButton>
        <Dialog
          title="Message編集"
          actions={actions}
          model={false}
          open={this.state.isOpenDialog}
          autoScrollBodyContent={true}
        >
          <Tabs
            onChange={this.handleSlideIndex.bind(this)}
            value={this.state.slideIndex}
          >
            <Tab label="説明" value={0} />
            <Tab label="実験" value={1} />
          </Tabs>
          <SwipeableViews
            index={this.state.slideIndex}
            onChangeIndex={this.handleSlideIndex.bind(this)}
          >
            {this.DescriptionTab()}
            {this.ExperimentTab()}
          </SwipeableViews>
        </Dialog>
        <Snackbar
          open={this.state.isOpenSnackbar}
          message={this.state.snackbarMessage}
          autoHideDuration={2000}
          onRequestClose={this.handleRequestClose.bind(this)}
        />
      </span>
    )
  }
}

export default connect(mapStateToProps)(MessageEditor)
