const { blocks, data } = window.wp;

const { registerBlockType } = blocks;
const { dispatch, select } = data;

{{imports}}

const customBlocks = [
{{objects}}
];

function addCategory(category) {
  const categories = select('core/blocks').getCategories();

  if (categories.find(c => c.slug === category.slug)) {
    return;
  }
  categories.push(category);
  dispatch('core/blocks').setCategories([ category, ...categories ]);
}

const defaultCategory = {
  slug: '{{categorySlug}}',
  title: '{{categoryTitle}}',
};

// Register each block
customBlocks.forEach(block => {
  let category = Object.assign({}, defaultCategory, block.category);

  if (block.enabled === false) {
    return;
  }
  
  addCategory(category);

  registerBlockType(`${category.slug}/${block.name}`, { category: category.slug, ...block.settings })
});
