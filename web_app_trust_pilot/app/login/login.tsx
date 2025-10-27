export async function login(formData: FormData) {
    const user = {name: formData.get('name'), password: formData.get('password')}
    console.log(user);
}