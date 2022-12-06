<script>
  // core components
import IndexNavbar from "../components/Navbars/IndexNavbar.svelte";
 import { questions, sections } from "../formcontents";
 import SignaturePad from "signature_pad"
  import { onMount } from "svelte";

  
  $: step = 1;
  
  let responses = new Array(24).fill("").map(() => new Array(4).fill(""));
  let filled = Array(25).fill(false);

  let confirmWindow;


  // check authorization. this is only to redirect if no session is in place. api still needs these keys for subsequent requests
  // if (sessionStorage.getItem("userId") == null || sessionStorage.getItem("secretKey") == null) {
  //   window.location = "/login"
  // }
  // fetch("//api.digisignonline.com/eafab/employee/getauth/user", {
  //   body: {
  //     userId: sessionStorage.getItem("userId"),
  //     secretKey: sessionStorage.getItem("secretKey")
  //   }
  // }).then((value) => {
  //   if (value.status == 400) {
  //     window.location = "/login"
  //   }
  // }) 


  let authHeader = sessionStorage.getItem("userId") + ":" + sessionStorage.getItem("secretKey");

  $: {
    for (let i = 0; i < 24; i++) {
      if (responses[i][0] !== "" && responses[i][1] !== "" && responses[i][2] !== "" && responses[i][3] !== "") {
        filled[i] = true;
      }
      else 
        filled[i] = false;
    }
  }

  let signatureCanvas;
  let pad;
  let signatureImage = "";
  
  onMount(async () => {
    try {
      let value = await fetch("//api.digisignonline.com/eafab/employee/" + sessionStorage.getItem("userId"), {
        headers: {
          "Authorization": authHeader
        }
      })

      if (!value.ok)
        throw new Error();

      value = await value.json();
      for (let response in value.formResponses.sectionResponses)
      {
          responses[response] = [value.formResponses.sectionResponses[response].questionOne, value.formResponses.sectionResponses[response].questionTwo, value.formResponses.sectionResponses[response].questionThree, value.formResponses.sectionResponses[response].summary]
      } 
    } catch (e) {
      //
    }

    pad = new SignaturePad(signatureCanvas);
  })



  let socket;
  try {
    socket = new WebSocket("ws://api.digisignonline.com/eafab/employee")
  } catch (e) {
    // throw popup
  }

  let errors = new Array(24).fill("").map(() => new Array(4).fill(""));

  console.log(errors);

  function updateThroughSocket() {

    let sectionResponses = Array(25).fill({});

    for (let section in responses) {
      sectionResponses[section].questionOne = responses[section][0];
      sectionResponses[section].questionTwo = responses[section][1];
      sectionResponses[section].questionThree = responses[section][2];
      sectionResponses[section].summary = responses[section][3];
    }

    socket.send(JSON.stringify({
      userId: sessionStorage.getItem("userId"),
      secretKey: sessionStorage.getItem("secretKey"),
      formResponses: sectionResponses
    }))
  }

  function checkErrorsOnAllSteps() {

    // update error array to match section and field. the first error we find, set the step to that section. return the status of the errors. 
    let error = false;
    let firstStep = false;
    for (let section in responses)
    {
      for (let field in responses[section]) {
        if (responses[section][field] == "")
        {
          if (!firstStep)
          {
            step = parseInt(section)+1
            firstStep = true
          }
          error = true;
          errors[section][field] = "This field cannot be empty"
        }
      }
    }
    return error;
  }
  let opacity = false;

  function saveSignature() {
    signatureImage = pad.toDataUrl();
  }
  $: {
    console.log(responses);
    console.log(errors);
  
  }

</script>

<div>
  <div class="absolute bg-blueGray-100 w-full {opacity ? "opacity-50" : ""}">
    <IndexNavbar />
    <div class="relative bg-blueGray-800 md:pt-32 pb-32 pt-12 px-4 md:px-10 mx-auto w-full"/>
    <div class="px-4 md:px-10 mx-auto w-full -m-24">
      <div class="flex flex-wrap mt-4">
        <div class="w-full mb-12 px-4">
          <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white text-white">
            <div class="rounded-t mb-0 px-4 py-3 border-0">
              <div class="flex flex-wrap items-center">
                <div class="relative w-full px-4 max-w-full flex-grow flex justify-evenly">
                  {#each Array(25) as _, i}
                  <button class="w-10 h-10 text-black rounded-full border-2 {filled[i] ? "bg-gray-200" : "bg-white"}" on:click={() => step = i+1}
                  >
                    <p class="{i+1 == step ? "font-bold" : "font-normal"}">{i+1}</p>
                  </button>
                  {/each}
                </div>
              </div>
            </div>
            <div class="flex flex-col items-center">
              <div class="flex flex-col items-center justify-evenly w-4/5 mb-10 mt-5 gap-6 text-black overflow-x-auto">
                <!-- Projects table -->
                  {#if step !== 25}
                    <div class="terms-container w-full bg-gray-100 overflow-auto h-96 border-2">
                      {@html sections[step-1]}
                    </div>
                  {:else}
                    <h3>Affirm you agree to the terms presented by completing your signature</h3>
                  {/if}
                  <canvas class="{step == 25 ? "block" : "hidden"} border" height="175" width="400" bind:this={signatureCanvas} />
                  <div class="flex flex-col w-1/2 gap-8">
                    {#if step !== 25}
                      {#each Array(3) as _, i}
                          <div class="flex flex-col gap-2">
                              <label for="{step}-{i+1}">{questions[step-1][i]}</label>
                              <textarea class="h-30 rounded {errors[step-1][i] !== "" ? "border-red-600" : ""}" name="{step}-{i+1}" id="" bind:value={responses[step-1][i]} on:change={() => {
                                errors[step-1][i] = "";
                                updateThroughSocket();
                              }}></textarea>
                              <small class="text-red-600 {errors[step-1][i] !== "" ? "block" : "hidden"}">{errors[step-1][i]}</small>
                          </div>
                      {/each}
                      <div class="flex flex-col">
                          <label for="{step}-s">Summary of Section</label>
                          <textarea class="h-30 rounded {errors[step-1][3] !== "" ? "border-red-600" : ""}" name="{step}-s" id="" bind:value={responses[step-1][3]} on:change={() => {
                            errors[step-1][3] = "";
                            updateThroughSocket();
                          }}></textarea>
                          <small class="text-red-600 {errors[step-1][3] !== "" ? "block" : "hidden"}">{errors[step-1][3]}</small>
                      </div>
                    {/if}
                      <div class="flex flex-row justify-between mb-6">
                        {#if step != 1}
                        <button class="rounded border-2 border-blueGray-800 w-16 h-10" on:click={() => step--}>Back</button>
                        {/if}
    
                        {#if step != 25}
                        <button class="shadow-sm hover:shadow-lg hover:ease-in rounded ml-auto text-white bg-blueGray-800 w-16 h-10" on:click={() => step++}>Next</button>
                        {:else}
                        <button class="shadow-sm hover:shadow-lg rounded text-white bg-blueGray-800 w-16 h-10" on:click={() => {
                          // if (!checkErrorsOnAllSteps()) {
                          //   confirmSubission();
                          // }
                          confirmWindow.show();
                          opacity = true;

                        }}>Submit</button>
                        {/if}

                      </div>
                </div>
                <dialog class="border text-center opacity-100" bind:this={confirmWindow}>
                  <h3>You will not be able to modify your responses after submitting.</h3><br>
                    <h3>Are you sure you want to submit?</h3>
                  <div class="flex flex-row justify-evenly my-6">
                    <button class="rounded border-2 border-blueGray-800 w-16 h-10" on:click={() => {
                      confirmWindow.hidden = true;
                      opacity = false;
                    }}>Cancel</button>
                    <button class="shadow-sm hover:shadow-lg hover:ease-in rounded text-white bg-blueGray-800 w-16 h-10" on:click={() => {
                      socket.send(JSON.stringify({
                        userId: sessionStorage.getItem("userId"),
                        secretKey: sessionStorage.getItem("secretKey"),
                        isSubmitted: true
                      }))
                    }}>Submit</button>
                  </div>
                </dialog>
              </div>
            </div>
        </div>
      </div>
        <!-- <div class="w-full mb-12 px-4">
          
        </div> -->
      </div>
    </div>

  </div>
</div>