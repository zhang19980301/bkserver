/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-const-assign */
// eslint-disable-next-line strict
const nodemailer = require('nodemailer');

class Mail {
  sendEmail(title, toUserEmail, date) {
    // 创建Nodemailer传输器 SMTP 或者 其他 运输机制
    const smtpTransport = nodemailer.createTransport({
      service: '163',
      auth: {
        user: 'zsq15135068239@163.com',
        pass: 'VMSBKOPUEFDBBHOV', // 注：此处为授权码，并非邮箱密码
      },
    });
    const codeChars = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
      'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    ];
    let emailCode = '';
    for (let i = 0; i < 5; i++) {
      const num = (Math.random() * codeChars.length);
      emailCode += codeChars[parseInt(num)];
    }
    global[date] = emailCode;
    setTimeout(() => {
      delete global[date];
    }, 1000 * 60 * 5);
    // 定义transport对象并发送邮件
    try {
      const info = smtpTransport.sendMail({
        from: '"博客资源组" <zsq15135068239@163.com>', // 发送方邮箱的账号
        to: toUserEmail, // 邮箱接受者的账号
        subject: title, // Subject line
        html: `欢迎注册博客, 您的邮箱验证码是:<b>${emailCode}</b>`, // html 内容, 如果设置了html内容, 将忽略text内容
      });
      return info;
    } catch (error) {
      return error;
    }
  }
}

exports.Mail = new Mail();
