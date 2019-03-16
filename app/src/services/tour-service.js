import requester from '../api/requester';

class TourService {

    async all() {
        try {
            return await requester.get(`/tour`);
        } catch (err) {
            return err;
        }
    }

    async details(id) {
        try {
            return await requester.get(`/tour/details/${id}`);
        } catch (err) {
            return err;
        }
    }

    async create(tour) {
        try {
            return await requester.post(`/tour/create`, tour);
        } catch (err) {
            return err;
        }
    }

    async edit(tour) {
        try {
            return await requester.post(`/tour/edit/${tour.id}`, tour.tourData);
        } catch (err) {
            return err;
        }
    }

    async remove(obj) {
        let data = { creatorId: obj.creatorId }
        try {
            return await requester.delete(`/tour/remove/${obj.id}`, data);
        } catch (err) {
            return err;
        }
    }

    async star(id) {
        try {
            return await requester.post(`/tour/star/${id}`);
        } catch (err) {
            return err;
        }
    }

    async unstar(id) {
        try {
            return await requester.post(`/tour/unstar/${id}`);
        } catch (err) {
            return err;
        }
    }
}

export default TourService;