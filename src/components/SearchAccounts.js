import React, { Component } from "react";
import { MDBRow, MDBCol, MDBInput, MDBBtn } from "mdbreact";
import axios from 'axios';

export default class SearchFilter extends Component {

    constructor() {
        super();
        this.state = {
            content: '',
            data: {}
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmitForm = this.handleSubmitForm.bind(this);
    }

    handleChange = (e) => {
        this.setState({
            content: e.target.value
        })
    }

    handleSubmitForm(event) {
        event.preventDefault();
        axios.get(`https://api.github.com/search/repositories?q=user:${this.state.content}+is:public`)
            .then(response => {
                this.setState({
                    data: response.data.items
                })
            }).catch(err => {
                console.log(err)
            })
    }

    render() {
        let result = this.state.data;
        const postList = result.length ? (
            result.map(post => {
                const  date = new Date(post.updated_at);

                var hours = date.getHours();
                var minutes = date.getMinutes();
                var ampm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12;
                hours = hours ? hours : 12;
                minutes = minutes < 10 ? '0'+minutes : minutes;
                var strTime = hours + ':' + minutes + '' + ampm;
               
                const res = date.getDate() +'/' + (date.getMonth()+1) + '/'+ date.getFullYear() + ', '+ strTime;
                return (
                    <div className="col-md-2 card-container" key={post.id}>
                        <div className="card">
                            <div className="card-content">
                                <span className="card-title">{post.name}</span>
                                <hr />
                                <p className="card-description">{post.description}</p>
                                <p className="card-date">{res
                                }</p>
                            </div>
                        </div>
                    </div>
                )
            })
        ) : (
                <MDBCol className="error-msg"><h1>No Github repositories....</h1></MDBCol>
            )
        return (
            <div>
                <MDBRow>
                    <MDBCol className="col-md-2">
                        <h3>Github Demo</h3>
                    </MDBCol>
                    <MDBCol className="col-md-2 offset-md-7">
                        <MDBInput label="Github user ID" outline onChange={this.handleChange} />
                    </MDBCol>
                    <MDBCol className="col-md-1">
                        <MDBBtn className="btn btn-sm" type="submit" onClick={this.handleSubmitForm}>Search</MDBBtn>
                    </MDBCol>
                </MDBRow>
                <hr />
                <div className="row" style={{ marginTop: "1rem" }}>
                    {postList}
                </div>
            </div>
        );
    }
}