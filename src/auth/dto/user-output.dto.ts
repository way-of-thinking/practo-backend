import { CoreOutput } from 'src/common/dto/output.dto';
import { User } from 'src/user/entites/user.entity';

export class UserOutPut extends CoreOutput {
  user?: User;
}
