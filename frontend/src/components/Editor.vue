<template>
  <div ref="elem"></div>
</template>

<script>
import { ref, toRefs, onMounted, watch } from "vue";
import * as monaco from 'monaco-editor';

// TODO: Set up monaco to auto complete some cypress commands:
export default {
  props: {
    modelValue: {
      type: String,
      default: ""
    },
  },
  setup(props, { emit }) {
    const { modelValue } = toRefs(props);
    const elem = ref(null);
    const bindedValue = ref(modelValue.value);
    let _editor;

    // Watch value prop
    watch(modelValue, (newVal) => {
      if (newVal !== bindedValue.value) {
        _editor.getModel().setValue(newVal);
      }
    })

    // Watch binded val
    watch(bindedValue, (newVal) => {
      if (newVal !== modelValue.value) {
        emit("update:modelValue", newVal)
      }
    })

    onMounted(() => {
      // https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.istandaloneeditorconstructionoptions.html
      _editor = monaco.editor.create(elem.value, {
        value: modelValue.value,
        language: "javascript",
        minimap: { enabled: false },
        contextmenu: false,
        tabSize: 2
      });

      _editor.onDidChangeModelContent(() => {
        bindedValue.value = _editor.getValue();
      })
    })

    return {
      elem
    }
  }
}
</script>