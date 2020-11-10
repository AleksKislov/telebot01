const ftp = require("basic-ftp");
const { MYFTP_HOST, MYFTP_USER, MYFTP_PASSWORD } = require("../config/config.json");

async function example() {
  const client = new ftp.Client();
  client.ftp.verbose = true;
  try {
    await client.access({
      host: MYFTP_HOST,
      user: MYFTP_USER,
      password: MYFTP_PASSWORD,
      secure: true
    });
    console.log(await client.list());
    await client.uploadFrom("../images/logo.png", "logo_FTP.png");
    // await client.downloadTo("README_COPY.md", "README_FTP.md");
  } catch (err) {
    console.log(err);
  }
  client.close();
}

example();
