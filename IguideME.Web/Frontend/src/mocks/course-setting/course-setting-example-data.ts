const examplePeerGroup = { min_size: 5, personalized_peers: true };

const exampleConsent = { course_name: 'CS3216', text: 'I agree to the terms and conditions' };

const date = new Date();
const exampleNotification = [`${String(date.getFullYear())}/${String(date.getMonth())}/${String(date.getDate() + 1)}`];

export { exampleConsent, exampleNotification, examplePeerGroup };
