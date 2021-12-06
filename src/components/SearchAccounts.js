import React, { useState } from "react";
import axios from 'axios'
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import $ from "jquery";
import "jquery-ui/ui/widgets/accordion";
import "jquery-ui/themes/base/all.css";
toast.configure();

const SearchFilter = () => {
    const [user, setUser] = useState({
        username: "",
        data: {}
    });
    const onInputChange = e => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };
    const onSubmit = async e => {
        e.preventDefault();
        await axios.get(`https://api.github.com/search/repositories?q=user:${user.username}+is:public`)
            .then(response => {
                setUser({
                    data: response.data.items
                })
            }).catch(err => {
                console.log(err)
            })
    }
    const { username } = user;
    const ResultHtml = () => {
        var flag = true;
        if (user.username === "") {
            flag = false;
            $(".result-row").hide();
            return (
                <div></div>
            )
        }
        else {
            $(".result-row").show();
        }
        if (flag) {
            var result = user.data;
            const postList = result.length ? (
                result.map(post => {
                    const date = new Date(post.updated_at);

                    var hours = date.getHours();
                    var minutes = date.getMinutes();
                    var ampm = hours >= 12 ? 'PM' : 'AM';
                    hours = hours % 12;
                    hours = hours ? hours : 12;
                    minutes = minutes < 10 ? '0' + minutes : minutes;
                    var strTime = hours + ':' + minutes + '' + ampm;

                    const res = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ', ' + strTime;

                    return (
                        <div className="text-center">
                            <div className="col-md-2 card-container" key={post.id}>
                                <div className="card">
                                    <div className="card-content">
                                        <span className="card-title">{post.name}</span>
                                        <hr />
                                        <p className="card-description">{post.description}</p>
                                        <p className="card-date">{res}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })
            ) : (
                <div className="text-center">
                    <h1>No record found</h1>
                </div>
            )
            return (
                <div>
                    <postList />
                </div>
            )
        }
    }

    return (
        <div className="container">
            <div className="w-75 mx-auto mt-5 shadow p-1">
                <form >
                    <h2 className="text-center">Search A User</h2>
                    <div className="row">
                        <div className="col-8">
                            <div className="form-group">
                                <input
                                    type="text"
                                    className="form-control form-control-lg"
                                    placeholder="Enter"
                                    name="username"
                                    value={username}
                                    onChange={e => onInputChange(e)}
                                />
                            </div>
                        </div>
                        <div className="col-4">
                            <button className="btn btn-primary" onClick={e => onSubmit(e)}>Search</button>
                        </div>
                    </div>
                </form>
            </div>
            <div className="w-75 mx-auto mt-5 shadow p-1 result-row">
                <ResultHtml />
            </div>
        </div>
    );
}

export default SearchFilter;