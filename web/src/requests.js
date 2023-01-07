export async function reopenUser(userId) {
    let response = await fetch("//api.eafabsafety.com/employee/" + userId, {
      method: "put",
      headers: {"Authorization": "Bearer " + localStorage.getItem("token")},
      body: JSON.stringify({ submitted: "" })
    })

    if (!response.ok)
      errors.set("Something went wrong. Please try again later.")
    else 
    //   window.location.reload();
    ;
  }



export async function deleteUser(userId) {
    
    let response = await fetch("//api.eafabsafety.com/employee/" + userId, {
      method: "delete",
      headers: {"Authorization": "Bearer " + localStorage.getItem("token")},
    })
  
    if (!response.ok)
      setError("Something went wrong. Please try again later.")
    else 
      window.location.reload();
  }