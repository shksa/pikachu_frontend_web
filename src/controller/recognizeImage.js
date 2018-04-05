const recognizeImage = (imageFile) => {
  console.log('in uploadImage func')
  const formData = new FormData();
  formData.append('userName', 'guest');
  formData.append('userImage', imageFile);
  return fetch('/recognizeImage', {
    method: 'POST',
    body: formData,
  })
    .then(resp => resp.json())
    .then((array) => {
      console.log(array)
      return array
    })
    .catch(error => console.log(error))
};

module.exports = { recognizeImage };

