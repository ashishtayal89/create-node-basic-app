import arg from "arg";
import inquirer from "inquirer";

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      "--git": Boolean,
      "--yes": Boolean,
      "--install": Boolean,
      "--start": Boolean,
      "-g": "--git",
      "-y": "--yes",
      "-i": "--install"
    },
    {
      argv: rawArgs.slice(2)
    }
  );
  return {
    skipPrompts: args["--yes"] || false,
    git: args["--git"] || false,
    template: args._[0],
    runInstall: args["--install"] || false,
    startProject: args["--start"] || false
  };
}

async function promptForMissingOptions(options) {
  const defaultTemplate = "basic";
  if (options.skipPrompts) {
    return {
      ...options,
      template: options.template || defaultTemplate
    };
  }

  const questions = [];
  if (!options.template) {
    questions.push({
      type: "list",
      name: "template",
      message: "Please choose which project template to use",
      choices: ["basic", "websocket"],
      default: defaultTemplate
    });
  }

  if (!options.git) {
    questions.push({
      type: "confirm",
      name: "git",
      message: "Initialize a git repository?",
      default: false
    });
  }

  if (!options.runInstall) {
    questions.push({
      type: "confirm",
      name: "runInstall",
      message: "Install npm dependencies?",
      default: false
    });
  }

  if (!options.startProject) {
    questions.push({
      type: "confirm",
      name: "startProject",
      message: "Start the project?",
      default: false
    });
  }

  const answers = await inquirer.prompt(questions);
  return {
    ...options,
    template: options.template || answers.template,
    git: options.git || answers.git,
    runInstall:
      options.runInstall ||
      answers.runInstall ||
      options.startProject ||
      answers.startProject,
    startProject: options.startProject || answers.startProject
  };
}

export default async function getOptions(args) {
  let options = parseArgumentsIntoOptions(args);
  options = await promptForMissingOptions(options);
  return options;
}
