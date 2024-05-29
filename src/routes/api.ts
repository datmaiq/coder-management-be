import {Router} from 'express';

import users from "@src/handler/users";
import tasks from "@src/handler/tasks";


const apiRouter = Router()

const userRouter = Router();
userRouter.get("", users.list);
userRouter.post("", users.create);
apiRouter.use("/users", userRouter);

const taskRouter = Router();
taskRouter.post("", tasks.create)
taskRouter.get("/:id", tasks.getById)
taskRouter.get("", tasks.list)
taskRouter.put("/:id", tasks.updateById)
taskRouter.delete("/:id", tasks.softDeleteById)
apiRouter.use("/tasks", taskRouter)


export default apiRouter;
