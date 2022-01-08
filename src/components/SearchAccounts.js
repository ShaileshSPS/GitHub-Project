import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "jquery-ui/ui/widgets/accordion";
import "jquery-ui/themes/base/all.css";
toast.configure();

const SearchFilter = () => {
  const [user, setUser] = useState("");
  const [data, setData] = useState([]);
  const [resDisplay, setResDisplay] = useState(false);

  const onInputChange = (e) => {
    setUser(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (user === "") {
      toast("Enter Search Input");
    } else {
      await axios
        .get(
          `https://api.github.com/search/repositories?q=user:${user}+is:public`
        )
        .then((response) => {
          setData(response.data.items);
          setResDisplay(true);
        })
        .catch((err) => {
          setData([]);
        });
    }
  };

  const NoRecordFound = () => {
    return (
      <div className="text-center">
        <h1>No record found</h1>
      </div>
    );
  };

  const DataResponsePaint = () => {
    return (
      <>
        <div className="w-75 mx-auto mt-5 shadow p-1">
          {data.length !== 0 ? (
            data.map((item) => (
              <div className="row" key={item.id}>
                <div className="col-12 card-container">
                  <div className="card">
                    <div className="card-content">
                      <span className="card-title">{item.name}</span>
                      <hr />
                      <p className="card-description">{item.description}</p>
                      <p className="mt-0">
                        <strong>Language:</strong>
                        {item.language}
                      </p>
                      {item.topics.length !== 0 && (
                        <>
                          <div className="d-flex">
                            <strong>Tags:</strong>
                            {item.topics.map((item) => (
                              <p className="mx-1">{item}</p>
                            ))}
                          </div>
                        </>
                      )}
                      <a
                        href={item.html_url}
                        className="btn btn-sm btn-primary"
                      >
                        Read More
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <NoRecordFound />
          )}
        </div>
      </>
    );
  };

  return (
    <div className="container">
      <div className="w-75 mx-auto mt-5 shadow p-1">
        <form>
          <h2 className="text-center">Search A User</h2>
          <div className="row">
            <div className="col-8">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Enter"
                  name="username"
                  value={user}
                  onChange={(e) => onInputChange(e)}
                />
              </div>
            </div>
            <div className="col-4">
              <button className="btn btn-primary" onClick={(e) => onSubmit(e)}>
                Search
              </button>
            </div>
          </div>
        </form>
      </div>
      {resDisplay ? <DataResponsePaint /> : <></>}
    </div>
  );
};

export default SearchFilter;
