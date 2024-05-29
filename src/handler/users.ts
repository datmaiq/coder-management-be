import {IReq, IRes} from './types/express/misc';

import User from "@src/models/User";

async function list(req: IReq<GetUsersRequest>, res: IRes) {
  try {
    let filter = {};
    const name = req.query.name as string;
    if (name) filter = {name: name}
    const users = await User.find(filter);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({error: 'internal server error'});
  }
}


async function create(req: IReq<CreateUserRequest>, res: IRes) {
  try {
    const {name} = req.body;

    if (!name) {
      res.status(400).json({error: 'name should not be empty'});
      return;
    }

    const newUser = new User({name, role: "employee"});
    await newUser.save();

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({error: 'internal server error'});
  }
}


export default {
  list,
  create,
} as const;
