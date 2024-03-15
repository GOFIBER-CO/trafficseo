import tinymce from "tinymce/tinymce";
const TableOfContentsPlugin = () => {
  const generateTOC = () => {
    const headings = [];
    const content = tinymce.activeEditor.getContent();
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");

    ["h1", "h2", "h3", "h4", "h5", "h6"].forEach((tag) => {
      const elements = doc.getElementsByTagName(tag);
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        const id = element.getAttribute("id");
        const text = element.innerText;
        if (id && text) {
          headings.push({ id, text });
        }
      }
    });

    const tocItems = headings.map(
      (heading, index) =>
        `<li><a href="#${heading.id}">${heading.text}</a></li>`
    );

    const tocHtml = `<div class="toc"><ul>${tocItems.join("")}</ul></div>`;
    tinymce.activeEditor.insertContent(tocHtml);
  };

  return {
    text: "Table of Contents",
    icon: "toc",
    onclick: generateTOC,
  };
};
export default TableOfContentsPlugin;
