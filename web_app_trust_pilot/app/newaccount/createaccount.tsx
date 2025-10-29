export async function createaccount(formData: FormData){
    const user = {name: formData.get('username'), password: formData.get('password'), email: formData.get('email')}
    console.log(user);
}