import getOptions from "./options";
import { createProject } from "./main";

export async function cli(args) {
  const options = await getOptions(args);
  await createProject(options);
}
