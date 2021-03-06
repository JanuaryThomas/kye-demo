// @ts-check
import React, { Component, useState, useEffect, createRef } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { storage } from "firebase";
import { upperFirst, clone, map, omit, padStart } from "lodash";
import uuidV1 from "uuid/v1";
import {
    Paper,
    Typography,
    Button,
    Grid,
    TextField,
    Select,
    InputLabel,
    FormControl,
    MenuItem
} from "@material-ui/core";
import {
    persistOrderResults,
    uploadFile,
    friendlyFormatDate,
    isValidDate
} from "../../../../utils";

function CivilLitigation({ order, type, toggleSnackBar }) {
    const [state, setstate] = useState({
        date: "",
        caseNumber: "",
        caseNature: "",
        partiesInvolved: "",
        rullingComments: "",
        comments: "",
        supportingDocsURL: "",
        score: "",
        uploadingAttachment: false,
        loading: false
    });

    useEffect(() => {
        const initialState = { ...state, ...order[type] };
        setstate(initialState);
    }, []);

    let fileUploaderRef = createRef();

    function handleChange(field, value) {
        state[field] = value;
        return setstate(clone(state));
    }

    function uploadAttachment(evt) {
        if (state.uploadingAttachment) return;
        const file = evt.target.files[0];

        setstate({ ...state, uploadingAttachment: true });
        uploadFile(file, "supporting-documents")
            .then(res => {
                res.ref.getDownloadURL().then(url =>
                    setstate({
                        ...state,
                        uploadingAttachment: false,
                        supportingDocsURL: url
                    })
                );
            })
            .catch(error => {
                alert(
                    "There was an error uploading your assets, please try again"
                );
                setstate({ ...state, uploadingAttachment: false });
            });
    }

    function saveCivilLitigation() {
        const { comments, supportingDocsURL, loading } = state;
        if (loading) return;
        if (!isValidDate(state.date)) {
            return alert("Please enter a valid date");
        }
        if (comments.length < 5) {
            alert("Comments are too short. Please enter valid comments.");
            return;
        }

        if (supportingDocsURL.length < 5) {
            alert("Please upload any supporting documents");
            return;
        }

        setstate({ ...state, loading: true });

        persistOrderResults(
            order.id,
            type,
            omit(state, ["loading", "uploadingAttachment"])
        )
            .then(res => {
                toggleSnackBar({
                    message: "Civil Litigation Reports updated successfully!"
                });
            })
            .catch(error => {
                toggleSnackBar({
                    message:
                        "Error. There was an error updating the social media report."
                });
                console.log("Error: ", error);
            })
            .finally(() => {
                setstate({ ...state, loading: false });
            });
    }

    return (
        <Paper style={{ padding: "1em", marginTop: 15 }}>
            <Typography variant="h6">Civil Litigation</Typography>

            <Grid container style={{ marginTop: 5 }}>
                <Grid
                    item
                    xs
                    md={6}
                    lg={4}
                    style={{ paddingLeft: 3, paddingRight: 3 }}
                >
                    <TextField
                        id="outlined-name"
                        label="Date checks were conducted"
                        value={state.date}
                        type="date"
                        onChange={({ target }) =>
                            handleChange("date", target.value)
                        }
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        style={{ margin: 3 }}
                    />
                </Grid>
                <Grid
                    item
                    xs
                    md={6}
                    lg={4}
                    style={{ paddingLeft: 3, paddingRight: 3 }}
                >
                    <TextField
                        id="outlined-name"
                        label="Case Number"
                        value={state.caseNumber}
                        onChange={({ target }) =>
                            handleChange("caseNumber", target.value)
                        }
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        style={{ margin: 3 }}
                    />
                </Grid>
                <Grid
                    item
                    xs
                    md={6}
                    lg={4}
                    style={{ paddingLeft: 3, paddingRight: 3 }}
                >
                    <TextField
                        id="outlined-name"
                        label="Nature of Case"
                        value={state.caseNature}
                        onChange={({ target }) =>
                            handleChange("caseNature", target.value)
                        }
                        fullWidth
                        margin="normal"
                        select
                        variant="outlined"
                        style={{ margin: 3 }}
                    >
                        <MenuItem value={"criminal"}>Criminal</MenuItem>
                        <MenuItem value={"civil"}>Civil</MenuItem>
                        <MenuItem value={"other"}>
                            Other (add to comments)
                        </MenuItem>
                    </TextField>
                    {/* <FormControl fullWidth>
						<InputLabel fullWidth htmlFor="demo-controlled-open-select">
							Nature of Case
						</InputLabel>
						<Select
							// open={open}
							value={state.caseNature}
							fullWidth
							// onChange={() => {}}
							onChange={({ target }) => handleChange("caseNature", target.value)}
							inputProps={{
								name: "gender",
								id: "demo-controlled-open-select"
							}}
						>
							<MenuItem value={"criminal"}>Criminal</MenuItem>
							<MenuItem value={"civil"}>Civil</MenuItem>
							<MenuItem value={"other"}>Other (add to comments)</MenuItem>
						</Select>
					</FormControl> */}
                </Grid>
                <Grid
                    item
                    xs
                    md={6}
                    style={{ paddingLeft: 3, paddingRight: 3, marginTop: 5 }}
                >
                    <TextField
                        id="outlined-name"
                        label="Parties Involved"
                        value={state.partiesInvolved}
                        onChange={({ target }) =>
                            handleChange("partiesInvolved", target.value)
                        }
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        style={{ margin: 3 }}
                    />
                </Grid>
            </Grid>
            <Grid container style={{ marginTop: 5 }}>
                <Grid
                    item
                    xs
                    md={6}
                    style={{ paddingLeft: 3, paddingRight: 3, marginTop: 5 }}
                >
                    <TextField
                        id=""
                        value={state.score}
                        onChange={({ target }) =>
                            handleChange("score", target.value)
                        }
						select
						label="Score"
                        style={{ margin: 3 }}
                        className="wide"
                        margin="normal"
                        variant="outlined"
                    >
                        <MenuItem value="good">Good</MenuItem>
                        {/* <MenuItem value="average">Average</MenuItem> */}
                        <MenuItem value="bad">Bad</MenuItem>
                    </TextField>
                </Grid>
            </Grid>

            <Grid container style={{ marginTop: 5 }}>
                <Grid
                    item
                    xs={12}
                    sm={12}
                    style={{ paddingLeft: 3, paddingRight: 3 }}
                >
                    <TextField
                        fullWidth
                        label="Rulling Comments"
                        value={state.rullingComments}
                        onChange={({ target }) =>
                            handleChange("rullingComments", target.value)
                        }
                        id="outlined-dense-multiline"
                        margin="dense"
                        variant="outlined"
                        multiline
                        rowsMax="4"
                        rows="3"
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3} style={{ marginTop: 5 }}>
                <Grid
                    item
                    xs={12}
                    sm={12}
                    style={{ paddingLeft: 3, paddingRight: 3 }}
                >
                    <TextField
                        fullWidth
                        label="Comments & Findings"
                        value={state.comments}
                        onChange={({ target }) =>
                            handleChange("comments", target.value)
                        }
                        id="outlined-dense-multiline"
                        margin="dense"
                        variant="outlined"
                        multiline
                        rowsMax="4"
                        rows="3"
                    />
                </Grid>
            </Grid>

            <Grid container style={{ marginTop: 10 }}>
                <Grid
                    item
                    xs={2}
                    sm={2}
                    style={{ paddingLeft: 3, paddingRight: 3 }}
                >
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={saveCivilLitigation}
                    >
                        {state.loading ? "Loading" : "Save"}
                    </Button>
                </Grid>

                <Grid
                    item
                    xs={2}
                    sm={3}
                    style={{ paddingLeft: 3, paddingRight: 3 }}
                >
                    <Button
                        variant={
                            state.supportingDocsURL.length > 0
                                ? "text"
                                : "contained"
                        }
                        color="primary"
                        onClick={() => fileUploaderRef.current.click()}
                    >
                        {state.uploadingAttachment
                            ? "Uploading..."
                            : state.supportingDocsURL.length > 0
                            ? "Update Supporting Documents"
                            : "Upload Supporting Documents"}
                    </Button>
                </Grid>
            </Grid>

            <input
                type="file"
                accept="application/pdf,application/vnd.ms-excel,application/zip,application/x-zip,application/x-zip-compressed"
                ref={fileUploaderRef}
                onChange={uploadAttachment}
                id="attachmentUploader"
                className="hidden"
            />
        </Paper>
    );
}

const mapState = state => ({
    snackbar: state.snackbar
});

const mapDispatch = ({ snackbar: { asyncToggleSnackBar } }) => ({
    toggleSnackBar: payload => asyncToggleSnackBar(payload)
});

export default connect(mapState, mapDispatch)(CivilLitigation);
