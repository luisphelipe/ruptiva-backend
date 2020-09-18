import { Factory } from "rosie";

const UserFactory = new Factory()
  .sequence("email", (i) => `test${i}@email.com`)
  .attr("password", "password");

export default UserFactory;
