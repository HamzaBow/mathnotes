import React, { useState, useRef, useEffect } from 'react'
import FormFace from './FormFace'

const CardForm = () => {

    //TODO: what if by mistake two properties are both true !!!, must figure out a better way to do this.
    const [formState, setFormState] = useState({
        front: true,
        back: false,
        other: false,
    })

    const front = useRef()
    const back = useRef()
    const other = useRef()

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

    }, [formState]);


    //TODO: use useReducer instead of useState (dispatch instead of two functions)
    function next(){
        if(formState.front === true){
            setFormState({front: false, back: true, other: false})            
        }
        if(formState.back === true){
            setFormState({front: false, back: false, other: true})            
        }
    }

    function prev(){
        if(formState.back === true){
            setFormState({front: true, back: false, other: false})            
        }
        if(formState.other === true){
            setFormState({front: false, back: true, other: false})            
        }
    }


    return (
        // <>
        //     <div id="card-form__face card-form__face--front" ref={front}><FormFace  face="front" next={next} /></div>
        //     <div id="card-form__face card-form__face--back"  ref={back}> <FormFace  face="back"  next={next} prev={prev}/></div>
        //     <div id="card-form__face card-form__face--other" ref={other}><FormFace  face="other"             prev={prev}/></div>
        // </>
        <>
            <div id="card-form__face" ref={front}><FormFace  face="front" next={next} /></div>
            <div id="card-form__face"  ref={back}> <FormFace  face="back"  next={next} prev={prev}/></div>
            <div id="card-form__face" ref={other}><FormFace  face="other"             prev={prev}/></div>
        </>
    )
}

export default CardForm
