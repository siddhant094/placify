import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import {
    VALIDATOR_REQUIRE,
    VALIDATOR_MINLENGTH,
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import './PlaceForm.css';

const NewPlace = () => {
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

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

    const history = useHistory();

    const placeSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            await sendRequest(
                'http://localhost:5000/api/places',
                'POST',
                JSON.stringify({
                    title: formState.inputs.title.value,
                    description: formState.inputs.description.value,
                    address: formState.inputs.address.value,
                    creator: auth.userId,
                }),
                {
                    'Content-Type': 'application/json',
                }
            );
            history.push('/');
        } catch (err) {}
    };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <form className='place-form' onSubmit={placeSubmitHandler}>
                {isLoading && <LoadingSpinner asOverlay />}
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
        </React.Fragment>
    );
};

export default NewPlace;
