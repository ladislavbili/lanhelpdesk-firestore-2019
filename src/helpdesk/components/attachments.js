import React, { Component } from "react";

export default class Attachments extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="m-t-10">
        <div className="row">
          <div className="full-width">
            <table className="table">
              <thead>
                <tr className="tr-no-lines">
                  <th
                    style={{
                      fontSize: "14px",
                      fontFamily: "Segoe UI Bold",
                      color: "#333"
                    }}
                  >
                    Attachment
                  </th>
                  <th className="t-a-r" width="124"></th>
                </tr>
              </thead>
              <tbody>
                {this.props.attachments.map((attachment, index) => (
                  <tr key={index} className="tr-no-lines">
                    <td>
                      <a
                        target="_blank"
                        href={attachment.url}
                        style={{ cursor: "pointer" }}
                        rel="noopener noreferrer"
                      >
                        {attachment.title}
                      </a>
                    </td>

                    <td className="t-a-r">
                      <button
                        className="btn btn-link-reversed waves-effect"
                        onClick={() => {
                          if (window.confirm("Are you sure?")) {
                            this.props.removeAttachment(attachment);
                          }
                        }}
                      >
                        <i className="fa fa-times" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <label htmlFor="uploadInput" className="btn waves-effect">
              + Add New Attachment
            </label>
            <input
              type="file"
              id="uploadInput"
              multiple={true}
              style={{ display: "none" }}
              onChange={e => {
                if (e.target.files.length > 0) {
                  let files = [...e.target.files];
                  this.props.addAttachments(files);
                }
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}
