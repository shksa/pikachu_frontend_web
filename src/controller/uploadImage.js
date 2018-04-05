const uploadImage = (imageFile) => {
  console.log('in uploadImage func')
  const formData = new FormData();
  formData.append('userName', 'guest');
  formData.append('userImage', imageFile);
  return fetch('/uploadImage', {
    method: 'POST',
    body: formData,
  })
    .then(resp => resp.text())
    .then((text) => {
      console.log(text)
      return text
    })
    .catch(error => console.log(error))
};

module.exports = { uploadImage };

