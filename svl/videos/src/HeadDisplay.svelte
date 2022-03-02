<script>
    import { currentHighlighted } from './stores.js';
</script>

<style>
    div{
        background-color: salmon;
        width: 100%;
        height: 100px;
    }
</style>

<div>
    <h1>Current highlighted: {$currentHighlighted?.id}</h1>
</div>