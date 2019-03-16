import requester from '../api/requester';

class UserService {
    
    async all() {  
        try {
            return await requester.get(`/user/all`); 
        } catch(err) {
            return err;
        }           
    }

    async userDetails(id) {  
        try {
            return await requester.get(`/user/details/${id}`); 
        } catch(err) {
            return err;
        }           
    }

    async delete(obj) { 
        console.log(obj)
        let data = {id2: obj.id2} 
        try {
            return await requester.delete(`/user/delete/${obj.id}`, data); 
        } catch(err) {
            return err;
        }           
    }
}

export default UserService;