import sleep from './sleep';

const showAlert = async (ops: { type: string, msg: string }) => {
  let typeAlert = "", alertObj = document.getElementById("myAlert"); let time = 1;
  if (alertObj) {
    if (ops.type === "ok") {
      typeAlert = "alert-success";
    } else if (ops.type === "err") {
      time *= 2.5;
      typeAlert = "alert-danger";
    } else if (ops.type === "war") {
      time *= 1.5;
      typeAlert = "alert-warning";
    } else {
      typeAlert = "alert-info";
    }
    alertObj.style.display = "";
    let txt = alertObj.getElementsByClassName("text")[0];
    txt.textContent = ops.msg;
    alertObj.classList.add(typeAlert);
    await sleep(time / 2 * 500);
    alertObj.classList.add("show");
    await sleep(time * 2000);
    alertObj.classList.remove("show");
    await sleep(time / 2 * 500);
    alertObj.classList.remove(typeAlert);
    txt.textContent = "";
    alertObj.style.display = "none";
  }
}

export default showAlert;
