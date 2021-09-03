import React, { useState, useRef, useEffect, useReducer } from 'react'
import { useParams } from 'react-router-dom'
import FormFace from './FormFace'
import FormOther from './FormOther'

import CardFormHeader from './CardFormHeader'
import CardFormStepper from './CardFormStepper'
import SuccessSnackBar from "./SuccessSnackBar";
import Overlay from '../utilities/Overlay'
import { CARDS_ACTIONS, CARD_FORM_ACTIONS, FIELD_TYPE } from "../../Constants";

const CardForm = ( { operationType, cards, cardsDispatch } ) => {

    const params = useParams();

    // ******************************************* FIELDS *******************************************
    function newField(id, fieldType) {
        if (fieldType === FIELD_TYPE.TEXT) {
        return {
            id,
            type: fieldType,
            htmlContent: "",
        };
        }

        if (fieldType === FIELD_TYPE.MATH) {
        return {
            id,
            type: fieldType,
            latex: "",
        };
        }
    }

    function fieldsReducer(fields, action) {
        let face = 'front';
        let otherFace = 'back';

        if(action.payload.face === 'back'){
            face = 'back';
            otherFace = 'front';
        }

        switch (action.type) {
            case CARD_FORM_ACTIONS.ADD_TEXT_QUILL:
                return { [otherFace]: fields[otherFace], [face]: [...fields[face], newField(action.payload.id, FIELD_TYPE.TEXT)]};

            case CARD_FORM_ACTIONS.ADD_MATH_QUILL:
                return { [otherFace]: fields[otherFace], [face]: [...fields[face], newField(action.payload.id, FIELD_TYPE.MATH)]};

            case CARD_FORM_ACTIONS.UPDATE_LATEX:
                return {[otherFace]: [...fields[otherFace]], [face]: fields[face].map((field) => {
                if(field.id === action.payload.id){
                    return { ...field, latex: action.payload.latex };
                }
                return field;
                })}

            case CARD_FORM_ACTIONS.UPDATE_HTML_CONTENT:
                return {[otherFace]: fields[otherFace], [face]: fields[face].map((field) => {
                if(field.id === action.payload.id){
                    return { ...field, htmlContent: action.payload.htmlContent };
                }
                return field;
                })}
            case CARD_FORM_ACTIONS.SET_FIELDS:
                return action.payload.fields;

            default:
                return fields;
        }
    }

    const [fields, fieldsDispatch] = useReducer(fieldsReducer, {front: [], back: [], other: []});



    // ****************************************** Difficulty Levels ****************************************
    const [difficultyLevels, setDifficultyLevels] = useState({veryEasy: false, easy: false, medium: false, hard: false, veryHard: false})

    // ************************************************* Tags *********************************************
    const [tags, setTags] = useState([])


    // *************************************** END OF NEW CARD-RELATED STATES ****************************************

    useEffect(() => {
        if(operationType === 'edit'){
            const card = cards.find(card => card.id === params.id)
            fieldsDispatch({type: CARD_FORM_ACTIONS.SET_FIELDS, payload: {fields: {front: card.front, back: card.back} }})
            setDifficultyLevels(card.difficultyLevels)
            setTags(card.tags)
        }
    }, [])


    //TODO: what if by mistake two properties are both true !!!, must figure out a better way to do this.
    const [formState, setFormState] = useState({
        front: true,
        back: false,
        other: false,
    })

    const [finished, setFinished] = useState(false);

    const front = useRef()
    const back = useRef()
    const other = useRef()  // other is the last form where the user adds tags and difficulty levels to the new card.

    const [activeStep, setActiveStep] = React.useState(0);

    useEffect(() => {
        front.current.style.transform = "translate(  -50%, -150vh )";
        front.current.style.animation = "transition: transform 0.2s ease-in-out";
    },[])

    useEffect(() => {

        if(operationType === 'create'){
            document.title = 'New Card';
        }
        if(operationType === 'edit'){
            document.title = 'Edit Card';
        }
        return () => {
            document.title = 'MathCards';
        }
    },[operationType])

    //TODO: FIXME: refactor the inside of this useEffect hook (probably requires refactoring the whole page)
    useEffect(() => {

      if (formState.front === true) {
        front.current.style.transform = "translate(  -50%, -50% )";
        
        back.current.style.transform = "translate( 100vw, -50% )";

        other.current.style.transform = "translate( 100vw, -50% )";
      }

      if (formState.back === true) {
        front.current.style.transform = "translate(  -100vw, -50% )";

        back.current.style.transform  = "translate(  -50%, -50% )";

        other.current.style.transform = "translate( 100vw, -50% )";
      }


      if (formState.other === true) {
        front.current.style.transform = "translate(  -100vw, -50% )";

        back.current.style.transform  = "translate(  -100vw,  -50% )";

        other.current.style.transform = "translate(  -50%, -50% )";
      }

    }, [formState]);
    


    //TODO: use useReducer instead of useState (dispatch instead of two functions)
    function next(){
        if(formState.front === true){
            setFormState({front: false, back: true, other: false})            
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
        if(formState.back === true){
            setFormState({front: false, back: false, other: true})            
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    }

    function prev(){
        if(formState.back === true){
            setFormState({front: true, back: false, other: false})            
            setActiveStep((prevActiveStep) => prevActiveStep - 1);
        }
        if(formState.other === true){
            setFormState({front: false, back: true, other: false})            
            setActiveStep((prevActiveStep) => prevActiveStep - 1);
        }
    }
// className="card-form__face card-form--other"
    const addCard = async () =>{
        const res = await fetch('http://localhost:5000/cards',{
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({id: `${Date.now().toString()} - ${Math.random().toString().slice(2,6)}`, 
                                  ...fields, difficultyLevels, tags})
        })
        const data = await res.json()
        cardsDispatch({type: CARDS_ACTIONS.NEW_CARD, payload: { card: data}})
    }

    const updateCard = async () =>{
        const res = await fetch(`http://localhost:5000/cards/${params.id}`,{
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({id: params.id, ...fields, difficultyLevels, tags})
        })
        const data = await res.json()
        cardsDispatch({type: CARDS_ACTIONS.UPDATE_CARD, payload: { data: data }})
    }

    return (
        <>
            <Overlay />
            { !finished ?
            <>
                <CardFormHeader > {operationType === "create" ? "New Card" : "Edit Card"}</CardFormHeader>
                <FormFace  ref={front} face="front" next={next}             fields={fields} fieldsDispatch={fieldsDispatch} />
                <FormFace  ref={back}  face="back"  next={next} prev={prev} fields={fields} fieldsDispatch={fieldsDispatch} />
                <FormOther operationType={operationType} ref={other} prev={prev} activeStep={activeStep} setActiveStep={setActiveStep}  setFinished={setFinished} difficultyLevels={difficultyLevels} setDifficultyLevels={setDifficultyLevels} tags={tags} setTags={setTags} addCard={addCard} updateCard={updateCard}/>
                <div style={{position:"fixed", bottom: "0", left: "25%", right: "0", width: "50%"}} >
                    <CardFormStepper activeStep={activeStep}  />
                </div>
            </>
            :
            <SuccessSnackBar />
            }
        </>
    )
}

export default CardForm
