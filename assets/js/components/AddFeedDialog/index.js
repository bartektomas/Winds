import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import Dialog from 'components/Dialog'

class AddFeedDialog extends Component {

    static defaultProps = {
        onSubmit: () => {},
        onReset: () => {},

        loading: false,
        error: false,
    }

    state = {
        url: '',
    }

    componentDidUpdate() {
        if (this.props.open) this.refs.url.focus()
    }

    handleChange = e => {
        this.setState({
            url: e.target.value,
        })
        this.props.onReset()
    }

    handleSubmit = e => {
        e.preventDefault()
        this.props.onSubmit({
            url: this.state.url,
        })
    }

    renderBtn() {

        if (this.props.error == true)
            return (
                <button
                    type="submit"
                    className="btn text-uppercase invalid-feed">
                    Feed Missing
                </button>
            )

        if (this.props.loading == true)
            return (
                <button
                    type="submit"
                    className="btn text-uppercase adding-feed">
                    Checking...
                </button>
            )

        return (
            <button
                type="submit"
                className="btn text-uppercase add-feed">
                Add Feed
            </button>
        )

    }

    render() {

        return (
            <Dialog {...this.props}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <form onSubmit={this.handleSubmit}>
                                <div className="url-container">
                                    <input
                                        id="url-input"
                                        type="text"
                                        ref="url"
                                        className="url"
                                        pattern="(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?"
                                        placeholder="Enter a valid site or feed URL"
                                        required={true}
                                        value={this.state.url}
                                        onChange={this.handleChange} />
                                    {this.renderBtn()}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </Dialog>
        )

    }
}

require('./styles.scss')

export default AddFeedDialog
