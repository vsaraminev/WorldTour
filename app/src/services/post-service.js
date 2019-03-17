import requester from '../api/requester';

class PostService {
    
    async allByTour(id) {  
        try {
            return await requester.get(`/post/allByTour/${id}`); 
        } catch(err) {
            return err;
        }           
    }

    async create(comment) {  
        try {
            return await requester.post(`/post/create`, comment); 
        } catch(err) {
            return err;
        }           
    }
}

export default PostService;