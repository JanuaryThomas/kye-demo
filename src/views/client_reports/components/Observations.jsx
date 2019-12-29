// @ts-check

//codes in this file are to be moved to different files in later commits
import React from "react";
import {
	Grid,
    Typography,
} from "@material-ui/core";

import {SectionHeader} from './Headers'



const Observations = ({ data}) => {

 

	return (
        <Grid container >
            <Grid container item style={{marginBottom:14}}>
                <Grid item xs={12} sm={12}>
                   <SectionHeader label="Observations" />
                </Grid>

            </Grid>
            <Grid container className="observations-container">
                {data.map((text,index)=>{
                     return(
                        <Grid container item key={index} style={{ marginBottom: "1em" }}>
                            <Grid item xs={12} sm={12}>
                             
                                <Typography variant="body1" component="body1">
                                  {index+1} . {text} 
                                </Typography>
                     
                            </Grid>
                        </Grid>                       
                     )
                })}
            </Grid>
        </Grid>
	);
};




export default Observations;