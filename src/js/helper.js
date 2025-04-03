import { TIMEOUT } from './config';
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export async function AJAX(url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);
    const results = await Promise.race([timeout(TIMEOUT), fetchPro]);
    const data = await results.json();
    if (!results.ok)
      throw new Error(`message : ${data.message}, status : ${data.status}`);
    return data;
  } catch (err) {
    throw err;
  }
}

// export async function getJSON(url) {
//   try {
//     const fetchPro = fetch(url);
//     const results = await Promise.race([timeout(TIMEOUT), fetchPro]);
//     const data = await results.json();
//     if (!results.ok)
//       throw new Error(`message : ${data.message}, status : ${data.status}`);
//     return data;
//   } catch (err) {
//     throw err;
//   }
// }

// export async function sendJSON(url, uploadData) {
//   try {
//     const fetchPro = fetch(url, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(uploadData),
//     });
//     const results = await Promise.race([timeout(TIMEOUT), , fetchPro]);
//     const data = await results.json();
//     if (!results.ok)
//       throw new Error(`message : ${data.message}, status : ${data.status}`);
//     return data;
//   } catch (err) {
//     throw err;
//   }
// }
