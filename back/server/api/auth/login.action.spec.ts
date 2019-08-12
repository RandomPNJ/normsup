// import * as _ from 'lodash';
// import unirest from 'unirest';
// import { expect } from 'chai';
// import {login as LoginAction} from './login.action';
// // import productRegistry from '../../components/product/productRegistry';


// describe('Login API action', () => {
//     // TODO : rewrite these test to login through HTTP REST API with server.renault
//     const app = global['app'];
//     const user = { 
//         'userName': 'Renault',
//         'password': 'bc4ren'
//     };
//     let accessFactory;
//     let accessService;

//     // before((done) => {
//         // accessService = app.get('AccessService');
//         // accessService.deploy()
//         //     .then(() => {
//         //         accessService.init()
//         //             .then(() => {
//         //                 done();
//         //             })
//         //     })
//         // ;
//     // });

//     it('has to return correct user information', (done) => {
//         let result: any;
//         LoginAction(user, app.get('AccessService'))
//             .then((res) => {
//                 result = res;
//                 expect(res).to.have.property('token');
//                 expect(res).to.have.property('user');
//                 done();
//             })
//             .catch((err) => {
//                 console.log(err);
//                 done(err);
//             })
//         ;
//     });

// });
