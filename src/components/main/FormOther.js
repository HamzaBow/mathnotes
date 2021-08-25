import React from "react";

import DifficultyLevels from "./DifficultyLevels";

import { Button } from "@material-ui/core"
import { ButtonGroup } from "@material-ui/core";

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import TopicTags from "./TopicTags";
import SuccessSnackBar from "./SuccessSnackBar";

const FormOther = ({ prev, activeStep, setActiveStep }, ref) => {

  const save = () => {
    if(activeStep !== 3){
      setActiveStep(prevStep => prevStep + 1)
    }
  }
  const previous = () => {
    prev()
    if(activeStep === 3){
      setActiveStep(prevStep => prevStep - 1) // prev() is going to decrement activeStep by one (total -2 decrement)
    }
    if(activeStep > 3){
      throw new RangeError(`value of activeStep shouldn't be greater than 3. activeStep has value ${activeStep}`)
    }
  }

  const hrStyle = {
    width: "32rem",
    opacity: "0.3",
  }



  return (
    <div className={'card-form__step'} ref={ref}>
        <h1 style={{ margin: 0 }}>Other Info</h1>
        <hr style={hrStyle}/>
        <DifficultyLevels />
        <hr style={hrStyle}/>
        <TopicTags />
        <ButtonGroup>
            <Button
              className="card-form__next-btn"
              variant="outlined"
              color="primary"
              startIcon={<ArrowBackIcon />}
              style={{ alignSelf: "end" }}
              onClick={() => previous()}
            >
              Prev
            </Button>

            <Button
              className="card-form__next-btn"
              variant="contained"
              color="primary"
              style={{ alignSelf: "end" }}
              onClick={() => save()}
            >
              save
            </Button>
        </ButtonGroup>

        <SuccessSnackBar open={activeStep === 3} setActiveStep={setActiveStep}/>
    </div>
  );
};


export default React.forwardRef(FormOther);
