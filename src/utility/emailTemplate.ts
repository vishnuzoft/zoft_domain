import * as dotenv from "dotenv";
import * as ejs from "ejs";
import * as fs from "fs";
import * as path from "path";

import { emailTemplatePath } from "../app";
import { environment } from "../config";

dotenv.config();
export function emailSenderTemplate(
  email: string,
  content: string,
  templatePath: string,
  data: any
) {
  const templatePaths: any = emailTemplatePath;
  const fullTemplatePath = path.join(templatePaths, templatePath);

  const templateContent = fs.readFileSync(fullTemplatePath, "utf8");
  const renderedTemplate = ejs.render(templateContent, { data });

  const mailOptions = {
    from: environment.EMAIL_USER,
    to: email,
    subject: content,
    html: renderedTemplate,
  };
  return mailOptions;
}
