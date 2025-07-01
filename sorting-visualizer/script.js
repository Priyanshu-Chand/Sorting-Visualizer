let array = [];
let speed = 50;

const arrayContainer = document.getElementById("array");

document.getElementById("arraySize").addEventListener("input", generateArray);
document.getElementById("speedInput").addEventListener("input", (e) => {
  speed = parseInt(e.target.value);
});

function generateArray() {
    const size = parseInt(document.getElementById("arraySize").value);
    speed = parseInt(document.getElementById("speedInput").value);
    array = [];
    arrayContainer.innerHTML = "";
  
    for (let i = 0; i < size; i++) {
      const value = Math.floor(Math.random() * 300) + 20;
      array.push(value);
  
      const barWrapper = document.createElement("div");
      barWrapper.classList.add("bar-wrapper");
  
      const label = document.createElement("div");
      label.classList.add("bar-label");
      label.innerText = value;
  
      const bar = document.createElement("div");
      bar.classList.add("bar");
      bar.style.height = `${value}px`;
  
      barWrapper.appendChild(label);
      barWrapper.appendChild(bar);
      arrayContainer.appendChild(barWrapper);
    }
  }
  
  

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function startSort() {
    const algo = document.getElementById("algorithm").value;
    switch (algo) {
      case "bubble":
        await bubbleSort();
        break;
      case "selection":
        await selectionSort();
        break;
      case "insertion":
        await insertionSort();
        break;
      case "merge":
        await mergeSort(0, array.length - 1);
        break;
      case "quick":
        await quickSort(0, array.length - 1);
        break;
      case "heap":
        await heapSort();
        break;
    }
  }
  

async function bubbleSort() {
    const bars = document.getElementsByClassName("bar");
    for (let i = 0; i < array.length - 1; i++) {
      for (let j = 0; j < array.length - i - 1; j++) {
        bars[j].style.backgroundColor = "red";
        bars[j + 1].style.backgroundColor = "red";
  
        if (array[j] > array[j + 1]) {
          [array[j], array[j + 1]] = [array[j + 1], array[j]];
          bars[j].style.height = `${array[j]}px`;
          bars[j + 1].style.height = `${array[j + 1]}px`;
          bars[j].innerText = array[j];
          bars[j + 1].innerText = array[j + 1];
        }
  
        await sleep(speed);
        document.querySelectorAll(".bar-label")[j].innerText = array[j];
        document.querySelectorAll(".bar-label")[j + 1].innerText = array[j + 1];

      }
  
      // Mark the last sorted bar in each pass
      bars[array.length - i - 1].style.backgroundColor = "limegreen";
    }
  
    // Final element is sorted
    bars[0].style.backgroundColor = "limegreen";
  }
  

async function selectionSort() {
  const bars = document.getElementsByClassName("bar");
  for (let i = 0; i < array.length; i++) {
    let min = i;
    bars[min].style.backgroundColor = "yellow";

    for (let j = i + 1; j < array.length; j++) {
      bars[j].style.backgroundColor = "red";
      await sleep(speed);

      if (array[j] < array[min]) {
        bars[min].style.backgroundColor = "#00ffcc";
        min = j;
        bars[min].style.backgroundColor = "yellow";
      } else {
        bars[j].style.backgroundColor = "#00ffcc";
      }
    }

    [array[i], array[min]] = [array[min], array[i]];
    bars[i].style.height = `${array[i]}px`;
    bars[min].style.height = `${array[min]}px`;

    bars[min].style.backgroundColor = "#00ffcc";
    bars[i].style.backgroundColor = "#00ffcc";
  }
}

async function insertionSort() {
  const bars = document.getElementsByClassName("bar");
  for (let i = 1; i < array.length; i++) {
    let key = array[i];
    let j = i - 1;

    while (j >= 0 && array[j] > key) {
      array[j + 1] = array[j];
      bars[j + 1].style.height = `${array[j + 1]}px`;
      bars[j + 1].style.backgroundColor = "red";
      j--;
      await sleep(speed);
    }
    array[j + 1] = key;
    bars[j + 1].style.height = `${key}px`;
    bars[j + 1].style.backgroundColor = "green";
  }
}

async function mergeSort(left, right) {
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);
    await mergeSort(left, mid);
    await mergeSort(mid + 1, right);
    await merge(left, mid, right);
  }
  
  async function merge(left, mid, right) {
    let merged = [];
    let i = left, j = mid + 1;
    while (i <= mid && j <= right) {
      if (array[i] < array[j]) {
        merged.push(array[i++]);
      } else {
        merged.push(array[j++]);
      }
    }
    while (i <= mid) merged.push(array[i++]);
    while (j <= right) merged.push(array[j++]);
  
    for (let k = left; k <= right; k++) {
      array[k] = merged[k - left];
      const bar = document.getElementsByClassName("bar")[k];
      const label = document.getElementsByClassName("bar-label")[k];
      bar.style.height = `${array[k]}px`;
      label.innerText = array[k];
      bar.style.backgroundColor = "#ffaa00";
      await sleep(speed);
      bar.style.backgroundColor = "#00ffcc";
    }
  }

  async function quickSort(low, high) {
    if (low < high) {
      const pi = await partition(low, high);
      await quickSort(low, pi - 1);
      await quickSort(pi + 1, high);
    }
  }
  
  async function partition(low, high) {
    let pivot = array[high];
    let i = low - 1;
  
    for (let j = low; j < high; j++) {
      const bars = document.getElementsByClassName("bar");
      bars[j].style.backgroundColor = "orange";
  
      if (array[j] < pivot) {
        i++;
        [array[i], array[j]] = [array[j], array[i]];
        updateBar(i);
        updateBar(j);
        await sleep(speed);
      }
  
      bars[j].style.backgroundColor = "#00ffcc";
    }
  
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    updateBar(i + 1);
    updateBar(high);
    await sleep(speed);
  
    return i + 1;
  }

  
  async function heapSort() {
    let n = array.length;
  
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      await heapify(n, i);
    }
  
    for (let i = n - 1; i > 0; i--) {
      [array[0], array[i]] = [array[i], array[0]];
      updateBar(0);
      updateBar(i);
      await sleep(speed);
      await heapify(i, 0);
    }
  }
  
  async function heapify(n, i) {
    let largest = i;
    let l = 2 * i + 1;
    let r = 2 * i + 2;
  
    if (l < n && array[l] > array[largest]) largest = l;
    if (r < n && array[r] > array[largest]) largest = r;
  
    if (largest !== i) {
      [array[i], array[largest]] = [array[largest], array[i]];
      updateBar(i);
      updateBar(largest);
      await sleep(speed);
      await heapify(n, largest);
    }
  }

  
  function updateBar(i) {
    const bars = document.getElementsByClassName("bar");
    const labels = document.getElementsByClassName("bar-label");
    bars[i].style.height = `${array[i]}px`;
    labels[i].innerText = array[i];
  }
  

generateArray(); // Generate once on load
