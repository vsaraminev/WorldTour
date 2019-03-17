import { toast } from 'react-toastify';

function isValidPost(state) {
    const globalError = 'Check your form for errors!';
    const contentError = "Content is required and must be between 3 and 200 symbols!";
    const STRING = 'string';
    
    let isValid = true;
    let errors = {};
    let payload = state.post;
    
    if(!payload || typeof payload.content !== STRING || payload.content.trim().length < 3 || payload.content.trim().length > 200) {
        errors.content = contentError
        isValid = false;
    }
    if(!isValid) {toast.error(globalError)}

    return {isValid, errors};
}

export default isValidPost;