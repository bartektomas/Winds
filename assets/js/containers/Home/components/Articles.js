import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'

import Hostname from 'components/Hostname'
import StripEntities from 'components/StripEntities'
import Summary from 'components/Summary'

import Waypoint from 'react-waypoint'

import * as ArticleActions from 'actions/Articles'
import * as PersonalizationActions from 'actions/Personalization'

@connect()
class Article extends Component {

    trackEngagement = e => this.props.dispatch(
        ArticleActions.engage(this.props.object.id, (this.props.index + 7))
    )

    trackImpression = () => this.props.dispatch(
        ArticleActions.impression(this.props.object.id)
    )

    handleClick = () => this.props.dispatch(
        PersonalizationActions.getStats()
    )

    render() {

        return (
            <div className="article" onClick={this.handleClick}>
                <div className="article-inner">
                    <Waypoint onEnter={() => {
                        this.trackImpression(this.props.object.id)
                    }} />
                    <a
                        href={this.props.object.articleUrl}
                        target="_blank"
                        data-id={this.props.object.id}
                        data-position={this.props.index}
                        onClick={this.trackEngagement}>
                        <div
                            className="image"
                            style={{ backgroundImage: `url('${!this.props.object.imageSrc ? 'http://i.imgur.com/GPfS63U.png' : this.props.object.imageSrc }')`}} />
                    </a>
                    <h2>
                        <a
                            href={this.props.object.articleUrl}
                            target="_blank"
                            onClick={this.trackEngagement}>
                            <StripEntities>{this.props.object.title}</StripEntities>
                        </a>
                    </h2>
                    <a
                        href={this.props.object.articleUrl}
                        target="_blank"
                        data-id={this.props.object.id}
                        data-position={this.props.index}
                        onClick={this.trackEngagement}>
                        <Summary limit={80}>{this.props.object.summary}</Summary>
                    </a>
                    <a
                        href={this.props.object.articleUrl}
                        target="_blank"
                        data-id={this.props.object.id}
                        data-position={this.props.index}
                        onClick={this.trackEngagement}>
                        {this.props.site.name || this.props.site.siteUrl}
                    </a>
                </div>
            </div>
        )
    }

}

@connect(state => ({ articles: state.Articles, }))
class Articles extends Component {

    state = {
        appending: false,
        page: 1,
        version: null,
    }

    handleScroll = e => {

        if (this.$i || this.state.appending) {
            clearTimeout(this.$i)
        }

        this.$i = setTimeout(() => {

            if (this.state.appending) return

            if (((this.$scrollY || 0) - window.scrollY) >= 0) {
                return
            }

            this.$scrollY = window.scrollY

            const offset = document.body.scrollTop + window.innerHeight,
                  height = document.body.offsetHeight

            if (offset > (height - 100)) {
                this.setState({ appending: true, page: this.state.page + 1, })
                this.props.dispatch(ArticleActions.load(this.state.page))
                    .then(() => this.setState({ appending: false, }))
            }
        }, 200)
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll)
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll)
    }

    render() {
        return (
            <div className="articles">
                {this.props.articles.slice(7).map((article, index) =>
                    <Article {...article} index={index} key={`article-${article.object.id}`} />
                )}
                {this.state.appending ? <div className="appending-loader">
                    <svg width="35px" height="35px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" className="uil-ring">
                        <rect x="0" y="0" width="100" height="100" fill="none" className="bk"></rect>
                        <defs>
                            <filter id="uil-ring-shadow" x="-100%" y="-100%" width="300%" height="300%">
                                <feOffset result="offOut" in="SourceGraphic" dx="0" dy="0"></feOffset>
                                <feGaussianBlur result="blurOut" in="offOut" stdDeviation="0"></feGaussianBlur>
                                <feBlend in="SourceGraphic" in2="blurOut" mode="normal"></feBlend>
                            </filter>
                        </defs>
                        <path d="M10,50c0,0,0,0.5,0.1,1.4c0,0.5,0.1,1,0.2,1.7c0,0.3,0.1,0.7,0.1,1.1c0.1,0.4,0.1,0.8,0.2,1.2c0.2,0.8,0.3,1.8,0.5,2.8 c0.3,1,0.6,2.1,0.9,3.2c0.3,1.1,0.9,2.3,1.4,3.5c0.5,1.2,1.2,2.4,1.8,3.7c0.3,0.6,0.8,1.2,1.2,1.9c0.4,0.6,0.8,1.3,1.3,1.9 c1,1.2,1.9,2.6,3.1,3.7c2.2,2.5,5,4.7,7.9,6.7c3,2,6.5,3.4,10.1,4.6c3.6,1.1,7.5,1.5,11.2,1.6c4-0.1,7.7-0.6,11.3-1.6 c3.6-1.2,7-2.6,10-4.6c3-2,5.8-4.2,7.9-6.7c1.2-1.2,2.1-2.5,3.1-3.7c0.5-0.6,0.9-1.3,1.3-1.9c0.4-0.6,0.8-1.3,1.2-1.9 c0.6-1.3,1.3-2.5,1.8-3.7c0.5-1.2,1-2.4,1.4-3.5c0.3-1.1,0.6-2.2,0.9-3.2c0.2-1,0.4-1.9,0.5-2.8c0.1-0.4,0.1-0.8,0.2-1.2 c0-0.4,0.1-0.7,0.1-1.1c0.1-0.7,0.1-1.2,0.2-1.7C90,50.5,90,50,90,50s0,0.5,0,1.4c0,0.5,0,1,0,1.7c0,0.3,0,0.7,0,1.1 c0,0.4-0.1,0.8-0.1,1.2c-0.1,0.9-0.2,1.8-0.4,2.8c-0.2,1-0.5,2.1-0.7,3.3c-0.3,1.2-0.8,2.4-1.2,3.7c-0.2,0.7-0.5,1.3-0.8,1.9 c-0.3,0.7-0.6,1.3-0.9,2c-0.3,0.7-0.7,1.3-1.1,2c-0.4,0.7-0.7,1.4-1.2,2c-1,1.3-1.9,2.7-3.1,4c-2.2,2.7-5,5-8.1,7.1 c-0.8,0.5-1.6,1-2.4,1.5c-0.8,0.5-1.7,0.9-2.6,1.3L66,87.7l-1.4,0.5c-0.9,0.3-1.8,0.7-2.8,1c-3.8,1.1-7.9,1.7-11.8,1.8L47,90.8 c-1,0-2-0.2-3-0.3l-1.5-0.2l-0.7-0.1L41.1,90c-1-0.3-1.9-0.5-2.9-0.7c-0.9-0.3-1.9-0.7-2.8-1L34,87.7l-1.3-0.6 c-0.9-0.4-1.8-0.8-2.6-1.3c-0.8-0.5-1.6-1-2.4-1.5c-3.1-2.1-5.9-4.5-8.1-7.1c-1.2-1.2-2.1-2.7-3.1-4c-0.5-0.6-0.8-1.4-1.2-2 c-0.4-0.7-0.8-1.3-1.1-2c-0.3-0.7-0.6-1.3-0.9-2c-0.3-0.7-0.6-1.3-0.8-1.9c-0.4-1.3-0.9-2.5-1.2-3.7c-0.3-1.2-0.5-2.3-0.7-3.3 c-0.2-1-0.3-2-0.4-2.8c-0.1-0.4-0.1-0.8-0.1-1.2c0-0.4,0-0.7,0-1.1c0-0.7,0-1.2,0-1.7C10,50.5,10,50,10,50z" fill="#16c98d" filter="url(#uil-ring-shadow)">
                            <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" repeatCount="indefinite" dur="1s"></animateTransform>
                        </path>
                    </svg>
                </div> : null}
            </div>
        )
    }

}

export default Articles
