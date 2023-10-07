import React from 'react';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import {
    VALIDATOR_REQUIRE,
    VALIDATOR_MINLENGTH,
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';

import './PlaceForm.css';

const NewPlace = () => {
    const [formState, inputHandler] = useForm(
        {
            title: {
                value: '',
                isValid: false,
            },
            description: {
                value: '',
                isValid: false,
            },
            address: {
                value: '',
                isValid: false,
            },
        },
        false
    );

    const placeSubmitHandler = (event) => {
        event.preventDefault(); // send this to backend
        console.log(formState.inputs);
    };

    return (
        <form className='place-form' onSubmit={placeSubmitHandler}>
            <Input
                id='title'
                type='text'
                label='Title'
                element='input'
                validators={[VALIDATOR_REQUIRE()]}
                errorText='Please enter a Valid Title'
                onInput={inputHandler}
            />
            <Input
                id='description'
                type='textarea'
                label='Description'
                element='textarea'
                validators={[VALIDATOR_MINLENGTH(5)]}
                errorText='Please enter a valid description (atleast 5 characters).'
                onInput={inputHandler}
            />
            <Input
                id='address'
                type='input'
                label='Address'
                element='input'
                validators={[VALIDATOR_REQUIRE()]}
                errorText='Please enter a valid address.'
                onInput={inputHandler}
            />
            {/* <Input type='number' label='Enter Phone Number:' element='input' /> */}
            {/* <Input type='text' label='Enter Address:' element='textarea' /> */}
            <Button type='submit' disabled={!formState.isValid}>
                ADD PLACE
            </Button>
        </form>
    );
};

export default NewPlace;
