import  {Router} from 'express';
import { register } from '../controllers/user.controller.js';
import { login } from '../controllers/user.controller.js';
import { updateUserProfile } from '../controllers/user.controller.js';
import { getUserAndProfile } from '../controllers/user.controller.js';
import multer from 'multer';
import { uploadProfilePicture } from '../controllers/user.controller.js';
import { updateProfileData } from '../controllers/user.controller.js';
import { getAllUserProfile } from '../controllers/user.controller.js';


const router=Router();

const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/')                                     ////multer storage for the user profile picture
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname)
        }
    })
const upload = multer({ storage: storage })      //uploading the above storage(const) to multer storage


router.route('/update_profile_picture')
.post(upload.single('profile_picture'),uploadProfilePicture);

router.route('/register').post(register);                          //routes
router.route('/login').post(login);
router.route('/user_update').post(updateUserProfile);
router.route('/get_user_and_profile').get(getUserAndProfile)
router.route('/update_profile_data').post(updateProfileData);
router.route('/user/get_all_users').get(getAllUserProfile);


export default router;