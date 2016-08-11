"use strict";
//repoName, senderName
module.exports = (type, payload) => {
  let defaultStruct = `**${payload.repoName}:**\n\n**${payload.senderName}**`;

  switch (type) {
    case "watch":
      return `**${payload.repoName}:** _**\`${payload.senderName}\`**_ starred this repo :star:`;
    case "push":
      var message = "",
          branch  = payload.ref.split("/")[payload.ref.split("/").length - 1];

      message += `**${payload.repoName}:**\n\n${payload.commits.length} commit${payload.commits.length > 1 ? 's' : ''} pushed to ${branch}`;
      payload.commits.forEach(commit => {
        message += `\n    \`${commit.id.slice(0, 7)}\` ${commit.message.split("\n"[0])} [${commit.committer.username}]`;
      });

      return message;
    case "pull_request":
      switch (payload.action) {
        case "opened":
          return `${defaultStruct} opened PR **#${payload.number}**: "${payload.pull_request.title}"\n<${payload.pull_request.html_url}>`;
        case "closed":
          return `${defaultStruct} ${payload.pull_request.merged ? "merged" : "closed"} PR **#${payload.number}**: "${payload.pull_request.title}"\n<${payload.pull_request.html_url}>`;
        case "synchronize":
          return `${defaultStruct} updated PR **#${payload.number}**: "${payload.pull_request.title}"\n<${payload.pull_request.html_url}>`;
      }
      break;
    case "issues":
      switch (payload.action) {
        case "opened":
        case "closed":
        case "repoened":
          return `${defaultStruct} ${payload.action} issue (\`#${payload.issue.number}\`): "${payload.issue.title}"\n<${payload.issue.html_url}>`;
      }
      break;
    case "issue_comment":
      return `${defaultStruct} commented on issue/PR **#${payload.issue.number}** (\`"${payload.issue.title}"\`)\n<${payload.issue.html_url}>`;
    case "fork":
      return `${defaultStruct} forked this repo to **${payload.forkee.full_name}**`;
    case "create":
    case "delete":
      return payload.ref_type !== "tag" ? `**${payload.ref_type === "repository" ? payload.repository.owner.login : payload.repoName}:**\n\n**${payload.senderName}** ${type}d ${payload.ref_type} **${payload.ref}**` : null;
    case "team_add":
      return `**${payload.senderName}** added repository \`${payload.repository.name}\` to **${payload.team.name}**`;
  }
};
