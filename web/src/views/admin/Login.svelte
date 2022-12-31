<script>
  import { link } from "svelte-routing";

  let errors = {
    popup: "",
    username: "",
    password: ""
  }

  async function formSubmit(e) {
    let response 
    try {
      response = await fetch("https://api.eafabsafety.com/auth/admin/signin", {
        method: 'POST',
        body: new URLSearchParams(new FormData(e.target))
      }) 
    } catch (e) {
      // console.log(e);
      errors.popup = "Network error, please try again later"
    }
    
    // console.log(new URLSearchParams(new FormData(e.target)))

    if (response.status == 401)
    {
      errors.popup = "Username or password invalid"
    } else if (response.status !== 201)
    {
      errors.popup = "Something went wrong, please try again later"
    }

    let data = await response.json();
    localStorage.setItem("token", (data.access_token));
    localStorage.setItem("user", (data.user));
    window.location = "/admin";
  }
</script>

<div class="container mx-auto px-4 h-full">
  {#if errors.popup}
    <div class="absolute top-0 left-0 h-full z-20 w-full flex flex-row justify-center">
      <div class="rounded border-2 w-36 h-4 p-4 bg-white">
        <h3>{errors.popup}</h3>
      </div>
    </div>
  {/if}
  <div class="flex content-center items-center justify-center h-full">
    <div class="w-full lg:w-4/12 px-4">
      <div
        class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0"
      >
        <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
          <div class="text-blueGray-400 text-center mb-3 font-bold mt-6">
            <h3>Administrator Sign-in</h3>
          </div>
          <form on:submit|preventDefault={formSubmit}>
            <div class="relative w-full mb-3">
              <label
                class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                for="grid-text"
              >
                Username
              </label>
              <input
                id="grid-text"
                type="text"
                name="username"
                class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                placeholder="Email"
              />
            </div>

            <div class="relative w-full mb-3">
              <label
                class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                for="grid-password"
              >
                Password
              </label>
              <input
                id="grid-password"
                type="password"
                name="password"
                class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                placeholder="Password"
              />
            </div>
            <div>
              <label class="inline-flex items-center cursor-pointer">
                <input
                  id="customCheckLogin"
                  type="checkbox"
                  class="form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                />
                <span class="ml-2 text-sm font-semibold text-blueGray-600">
                  Remember me
                </span>
              </label>
            </div>

            <div class="text-center mt-6">
              <button
                class="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                type="submit"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>
