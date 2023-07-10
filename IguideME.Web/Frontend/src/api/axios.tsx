import axios from "axios";


const baseURL = (): string => {
    return `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;
}

// automatically set the base url of each request to the current host
export default axios.create({
      baseURL: baseURL(),
      headers: { Authorization: `Bearer ${document.location.hash.slice(1)}` }
    });
