
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.4' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\Container.svelte generated by Svelte v3.46.4 */

    const file$6 = "src\\Container.svelte";

    function create_fragment$6(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_style(div, "min-width", /*width*/ ctx[0]);
    			set_style(div, "max-width", /*width*/ ctx[0]);
    			set_style(div, "height", /*height*/ ctx[1]);
    			set_style(div, "flex-direction", /*flexDirection*/ ctx[2]);
    			set_style(div, "margin", /*margin*/ ctx[3]);
    			set_style(div, "flex-grow", /*flexGrow*/ ctx[4]);
    			set_style(div, "align-items", /*alignItems*/ ctx[5]);
    			set_style(div, "background-color", /*backgroundColor*/ ctx[6]);
    			set_style(div, "padding", /*padding*/ ctx[7]);
    			set_style(div, "gap", /*gap*/ ctx[8]);
    			attr_dev(div, "class", "svelte-15ghbln");
    			add_location(div, file$6, 22, 0, 434);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 512)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[9],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[9])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[9], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*width*/ 1) {
    				set_style(div, "min-width", /*width*/ ctx[0]);
    			}

    			if (!current || dirty & /*width*/ 1) {
    				set_style(div, "max-width", /*width*/ ctx[0]);
    			}

    			if (!current || dirty & /*height*/ 2) {
    				set_style(div, "height", /*height*/ ctx[1]);
    			}

    			if (!current || dirty & /*flexDirection*/ 4) {
    				set_style(div, "flex-direction", /*flexDirection*/ ctx[2]);
    			}

    			if (!current || dirty & /*margin*/ 8) {
    				set_style(div, "margin", /*margin*/ ctx[3]);
    			}

    			if (!current || dirty & /*flexGrow*/ 16) {
    				set_style(div, "flex-grow", /*flexGrow*/ ctx[4]);
    			}

    			if (!current || dirty & /*alignItems*/ 32) {
    				set_style(div, "align-items", /*alignItems*/ ctx[5]);
    			}

    			if (!current || dirty & /*backgroundColor*/ 64) {
    				set_style(div, "background-color", /*backgroundColor*/ ctx[6]);
    			}

    			if (!current || dirty & /*padding*/ 128) {
    				set_style(div, "padding", /*padding*/ ctx[7]);
    			}

    			if (!current || dirty & /*gap*/ 256) {
    				set_style(div, "gap", /*gap*/ ctx[8]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Container', slots, ['default']);
    	let { width = "auto" } = $$props;
    	let { height = "auto" } = $$props;
    	let { flexDirection = "row" } = $$props;
    	let { margin = "0" } = $$props;
    	let { flexGrow = "0" } = $$props;
    	let { alignItems = "auto" } = $$props;
    	let { backgroundColor = "" } = $$props;
    	let { padding = "0" } = $$props;
    	let { gap = "0" } = $$props;

    	const writable_props = [
    		'width',
    		'height',
    		'flexDirection',
    		'margin',
    		'flexGrow',
    		'alignItems',
    		'backgroundColor',
    		'padding',
    		'gap'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Container> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('flexDirection' in $$props) $$invalidate(2, flexDirection = $$props.flexDirection);
    		if ('margin' in $$props) $$invalidate(3, margin = $$props.margin);
    		if ('flexGrow' in $$props) $$invalidate(4, flexGrow = $$props.flexGrow);
    		if ('alignItems' in $$props) $$invalidate(5, alignItems = $$props.alignItems);
    		if ('backgroundColor' in $$props) $$invalidate(6, backgroundColor = $$props.backgroundColor);
    		if ('padding' in $$props) $$invalidate(7, padding = $$props.padding);
    		if ('gap' in $$props) $$invalidate(8, gap = $$props.gap);
    		if ('$$scope' in $$props) $$invalidate(9, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		width,
    		height,
    		flexDirection,
    		margin,
    		flexGrow,
    		alignItems,
    		backgroundColor,
    		padding,
    		gap
    	});

    	$$self.$inject_state = $$props => {
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('flexDirection' in $$props) $$invalidate(2, flexDirection = $$props.flexDirection);
    		if ('margin' in $$props) $$invalidate(3, margin = $$props.margin);
    		if ('flexGrow' in $$props) $$invalidate(4, flexGrow = $$props.flexGrow);
    		if ('alignItems' in $$props) $$invalidate(5, alignItems = $$props.alignItems);
    		if ('backgroundColor' in $$props) $$invalidate(6, backgroundColor = $$props.backgroundColor);
    		if ('padding' in $$props) $$invalidate(7, padding = $$props.padding);
    		if ('gap' in $$props) $$invalidate(8, gap = $$props.gap);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		width,
    		height,
    		flexDirection,
    		margin,
    		flexGrow,
    		alignItems,
    		backgroundColor,
    		padding,
    		gap,
    		$$scope,
    		slots
    	];
    }

    class Container extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {
    			width: 0,
    			height: 1,
    			flexDirection: 2,
    			margin: 3,
    			flexGrow: 4,
    			alignItems: 5,
    			backgroundColor: 6,
    			padding: 7,
    			gap: 8
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Container",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get width() {
    		throw new Error("<Container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get flexDirection() {
    		throw new Error("<Container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set flexDirection(value) {
    		throw new Error("<Container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get margin() {
    		throw new Error("<Container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set margin(value) {
    		throw new Error("<Container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get flexGrow() {
    		throw new Error("<Container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set flexGrow(value) {
    		throw new Error("<Container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get alignItems() {
    		throw new Error("<Container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set alignItems(value) {
    		throw new Error("<Container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get backgroundColor() {
    		throw new Error("<Container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set backgroundColor(value) {
    		throw new Error("<Container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get padding() {
    		throw new Error("<Container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set padding(value) {
    		throw new Error("<Container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get gap() {
    		throw new Error("<Container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set gap(value) {
    		throw new Error("<Container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Navigation.svelte generated by Svelte v3.46.4 */

    const file$5 = "src\\Navigation.svelte";

    // (16:4) {#if isDropDownList}
    function create_if_block(ctx) {
    	let nav;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			if (default_slot) default_slot.c();
    			attr_dev(nav, "class", "nav-container svelte-99gyuq");
    			add_location(nav, file$5, 16, 8, 324);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);

    			if (default_slot) {
    				default_slot.m(nav, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(16:4) {#if isDropDownList}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*isDropDownList*/ ctx[1] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(/*name*/ ctx[0]);
    			t1 = space();
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "nav-item svelte-99gyuq");
    			add_location(div, file$5, 13, 0, 232);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    			if (if_block) if_block.m(div, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*Redirect*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*name*/ 1) set_data_dev(t0, /*name*/ ctx[0]);

    			if (/*isDropDownList*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*isDropDownList*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Navigation', slots, ['default']);
    	let { link } = $$props;
    	let { name } = $$props;
    	let { isDropDownList = false } = $$props;

    	function Redirect() {
    		if (isDropDownList == false) {
    			window.location.href = link;
    		}
    	}

    	const writable_props = ['link', 'name', 'isDropDownList'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Navigation> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('link' in $$props) $$invalidate(3, link = $$props.link);
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('isDropDownList' in $$props) $$invalidate(1, isDropDownList = $$props.isDropDownList);
    		if ('$$scope' in $$props) $$invalidate(4, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ link, name, isDropDownList, Redirect });

    	$$self.$inject_state = $$props => {
    		if ('link' in $$props) $$invalidate(3, link = $$props.link);
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('isDropDownList' in $$props) $$invalidate(1, isDropDownList = $$props.isDropDownList);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name, isDropDownList, Redirect, link, $$scope, slots];
    }

    class Navigation extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { link: 3, name: 0, isDropDownList: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Navigation",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*link*/ ctx[3] === undefined && !('link' in props)) {
    			console.warn("<Navigation> was created without expected prop 'link'");
    		}

    		if (/*name*/ ctx[0] === undefined && !('name' in props)) {
    			console.warn("<Navigation> was created without expected prop 'name'");
    		}
    	}

    	get link() {
    		throw new Error("<Navigation>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set link(value) {
    		throw new Error("<Navigation>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<Navigation>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Navigation>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isDropDownList() {
    		throw new Error("<Navigation>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isDropDownList(value) {
    		throw new Error("<Navigation>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\SideButton.svelte generated by Svelte v3.46.4 */

    const file$4 = "src\\SideButton.svelte";

    function create_fragment$4(ctx) {
    	let div;
    	let h1;
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			t = text(/*text*/ ctx[0]);
    			attr_dev(h1, "class", "svelte-1h1xc6p");
    			add_location(h1, file$4, 6, 4, 117);
    			attr_dev(div, "class", "svelte-1h1xc6p");
    			add_location(div, file$4, 5, 0, 67);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(h1, t);

    			if (!mounted) {
    				dispose = listen_dev(
    					div,
    					"click",
    					function () {
    						if (is_function(window.location.href = /*link*/ ctx[1])) (window.location.href = /*link*/ ctx[1]).apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			if (dirty & /*text*/ 1) set_data_dev(t, /*text*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SideButton', slots, []);
    	let { text } = $$props;
    	let { link } = $$props;
    	const writable_props = ['text', 'link'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SideButton> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    		if ('link' in $$props) $$invalidate(1, link = $$props.link);
    	};

    	$$self.$capture_state = () => ({ text, link });

    	$$self.$inject_state = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    		if ('link' in $$props) $$invalidate(1, link = $$props.link);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [text, link];
    }

    class SideButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { text: 0, link: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SideButton",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*text*/ ctx[0] === undefined && !('text' in props)) {
    			console.warn("<SideButton> was created without expected prop 'text'");
    		}

    		if (/*link*/ ctx[1] === undefined && !('link' in props)) {
    			console.warn("<SideButton> was created without expected prop 'link'");
    		}
    	}

    	get text() {
    		throw new Error("<SideButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<SideButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get link() {
    		throw new Error("<SideButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set link(value) {
    		throw new Error("<SideButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Title.svelte generated by Svelte v3.46.4 */

    const file$3 = "src\\Title.svelte";

    function create_fragment$3(ctx) {
    	let h1;
    	let t;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t = text(/*text*/ ctx[0]);
    			set_style(h1, "font-size", /*fontSize*/ ctx[1]);
    			set_style(h1, "font-family", /*fontFamily*/ ctx[2]);
    			set_style(h1, "color", /*color*/ ctx[3]);
    			set_style(h1, "margin", /*margin*/ ctx[4]);
    			attr_dev(h1, "class", "svelte-b0rjgn");
    			add_location(h1, file$3, 17, 0, 323);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*text*/ 1) set_data_dev(t, /*text*/ ctx[0]);

    			if (dirty & /*fontSize*/ 2) {
    				set_style(h1, "font-size", /*fontSize*/ ctx[1]);
    			}

    			if (dirty & /*fontFamily*/ 4) {
    				set_style(h1, "font-family", /*fontFamily*/ ctx[2]);
    			}

    			if (dirty & /*color*/ 8) {
    				set_style(h1, "color", /*color*/ ctx[3]);
    			}

    			if (dirty & /*margin*/ 16) {
    				set_style(h1, "margin", /*margin*/ ctx[4]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Title', slots, []);
    	let { text = "none" } = $$props;
    	let { fontSize = "32px" } = $$props;
    	let { fontFamily = "Ariel, Helvetica, sans-serif" } = $$props;
    	let { color = "black" } = $$props;
    	let { margin = "0" } = $$props;
    	const writable_props = ['text', 'fontSize', 'fontFamily', 'color', 'margin'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Title> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    		if ('fontSize' in $$props) $$invalidate(1, fontSize = $$props.fontSize);
    		if ('fontFamily' in $$props) $$invalidate(2, fontFamily = $$props.fontFamily);
    		if ('color' in $$props) $$invalidate(3, color = $$props.color);
    		if ('margin' in $$props) $$invalidate(4, margin = $$props.margin);
    	};

    	$$self.$capture_state = () => ({
    		text,
    		fontSize,
    		fontFamily,
    		color,
    		margin
    	});

    	$$self.$inject_state = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    		if ('fontSize' in $$props) $$invalidate(1, fontSize = $$props.fontSize);
    		if ('fontFamily' in $$props) $$invalidate(2, fontFamily = $$props.fontFamily);
    		if ('color' in $$props) $$invalidate(3, color = $$props.color);
    		if ('margin' in $$props) $$invalidate(4, margin = $$props.margin);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [text, fontSize, fontFamily, color, margin];
    }

    class Title extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
    			text: 0,
    			fontSize: 1,
    			fontFamily: 2,
    			color: 3,
    			margin: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Title",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get text() {
    		throw new Error("<Title>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Title>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fontSize() {
    		throw new Error("<Title>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fontSize(value) {
    		throw new Error("<Title>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fontFamily() {
    		throw new Error("<Title>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fontFamily(value) {
    		throw new Error("<Title>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Title>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Title>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get margin() {
    		throw new Error("<Title>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set margin(value) {
    		throw new Error("<Title>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var blogPosts = [];

    var post = new Object();
    post.title='Sajt je pomeren';
    post.date= '14. 01. 2022.';
    post.content=`<h1>fastmans2 je prebacen na hominglesi.github.io kao i suspicious dictionary.<br><br>
Kada sam pravio sve ove sajtove sam uvek morao da pravim i novi email i novi github za njih jer
jedan github account moze da ima samo jedan github page na kome se hostuje site.
U tome svemu sam se izgubio koji gmail je za sta i pozaboravljao sam lozinke (zbog cega je i bio
fastmans2 jer je prvi zaboravljen). Od sada ce svaki novi site biti ovde.<br><br>
Jos uvek ce se zvati fastmans dok ne promenim kako izgleda ovaj main page.</h1>`;
    blogPosts.push(post);

    post = new Object();
    post.title='Minesweeper Competition';
    post.date= '2019.11.10';
    post.content=`<h1> Takmicenje izmedju mene i skekule ko ce napraviti bolji minesweeper.<br><br>
S obzirom da ja vise od godinu dana radim u javascriptu a on je tek poceo sa c# formama mislim da je ovo veoma fer i da niko nema prednost.<br><br>
Moj sajt: <a href="https://hominglesi.github.io/p/mines/index.html">Mines</a><br>
Skekulin program: <a href="https://drive.google.com/open?id=1mHjXaS01AVa2fSt7E4LN80pnTixPa93W">Google drive</a><br>
Video skekulinog programa: <a href="https://youtu.be/Nv2sIySHONQ">Youtube</a><br>
</h1>`;
    blogPosts.push(post);

    post = new Object();
    post.title='New Stuff';
    post.date= '2019.10.24';
    post.content=`<h1> Toxic Man - 2019.10.22 - Linija na koju se mogu postavljati slike very cool.<br><br>
List Man - 2019.10.24 - Tier liste. Napravio sam da je veoma lako ubaciti razliciti setovi slika sto je bilo isto very cool.<br><br>
Sada pise na vrhu fastmans2 very cool.<br><br>
very cool<br><br>
ps. mozda je vreme za treci redizajn???</h1>`;
    blogPosts.push(post);

    post = new Object();
    post.title='Fastmans2???';
    post.date= '2019.10.7';
    post.content=`<h1>Prvo sam napravio <a href="https://fastmans.github.io">fastmans.github.io</a>,
ali sam naravno zaboravio sifru. Onda sam napravio <a href="https://fastermans.github.io">fastermans.github.io</a>,
ali ovoga puta nisam zaboravio sifru, zaboravio sam lozinku.
Vreme je za fastmans2.<br><br>
Dodao sam dugme da bi se prebacivalo sa starog dizajna na novi.
Ne znam zasto ali moglo mi se.(Artwork je naravno iz painta).<br><br>
Btw zelim da pitam sebe iz proslosti zasto sam mislio da bi
bilo pametno napisati datum kao godina.mesec.dan?<br><br>
Kao poslednje i naj bitnije, napravio sam very cool pong.
Nije najbolji al sam ga napravio bolje nego sto sam ocekivao.</h1>`;
    blogPosts.push(post);

    post = new Object();
    post.title='Drugi redizajn';
    post.date= '2018.10.18';
    post.content=`<h1>Sve što za ovo mogu reći je da kada se prave klase za velike sajtove treba davati tim klasama normalna imena.</h1>`;
    blogPosts.push(post);

    post = new Object();
    post.title='p5.js Library';
    post.date= '2018.10.14';
    post.content=`<h1>Ubacio sam biblioteku koju sam koristio za JavaScript i otkrio sam drugi način da pustim zvuk preko jos jedne biblioteke koja se zove Howler.js:
</h1>
<a href="https://p5js.org/">p5.js</a>
<br>
<a href="https://github.com/goldfire/howler.js">Howler.js</a>`;
    blogPosts.push(post);

    post = new Object();
    post.title='Web Test';
    post.date= '2018.10.13';
    post.content=`<h1>Saznali smo za sajtove koji mogu biti veoma korisni pri pravljenju
stranica i time sam ispravio "sve" greske koje sam imao. Ostaviću
ih ovde ako je neko zainteresovan da pogleda:</h1>

<a href="https://validator.w3.org/">HTML validator</a>
<br>
<a href="http://csslint.net/">CSS checker</a>`;
    blogPosts.push(post);

    post = new Object();
    post.title='Pocetak "normalne" strane';
    post.date= '2018.10.12';
    post.content=`<h1>Napokon sam napravio nesto što nije max kancer.<br>Yay</h1>`;
    blogPosts.push(post);

    /* src\BlogPost.svelte generated by Svelte v3.46.4 */

    const file$2 = "src\\BlogPost.svelte";

    function create_fragment$2(ctx) {
    	let div;
    	let h2;
    	let t0;
    	let t1;
    	let h3;
    	let t2;
    	let t3;
    	let p;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			t0 = text(/*title*/ ctx[0]);
    			t1 = space();
    			h3 = element("h3");
    			t2 = text(/*date*/ ctx[1]);
    			t3 = space();
    			p = element("p");
    			attr_dev(h2, "class", "svelte-n7dptf");
    			add_location(h2, file$2, 43, 4, 1013);
    			attr_dev(h3, "class", "svelte-n7dptf");
    			add_location(h3, file$2, 44, 4, 1035);
    			attr_dev(p, "class", "blogPostContent");
    			add_location(p, file$2, 45, 4, 1056);
    			add_location(div, file$2, 42, 0, 1002);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    			append_dev(h2, t0);
    			append_dev(div, t1);
    			append_dev(div, h3);
    			append_dev(h3, t2);
    			append_dev(div, t3);
    			append_dev(div, p);
    			p.innerHTML = /*content*/ ctx[2];
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*title*/ 1) set_data_dev(t0, /*title*/ ctx[0]);
    			if (dirty & /*date*/ 2) set_data_dev(t2, /*date*/ ctx[1]);
    			if (dirty & /*content*/ 4) p.innerHTML = /*content*/ ctx[2];		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('BlogPost', slots, []);
    	let { title } = $$props;
    	let { date } = $$props;
    	let { content } = $$props;
    	const writable_props = ['title', 'date', 'content'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<BlogPost> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('date' in $$props) $$invalidate(1, date = $$props.date);
    		if ('content' in $$props) $$invalidate(2, content = $$props.content);
    	};

    	$$self.$capture_state = () => ({ title, date, content });

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('date' in $$props) $$invalidate(1, date = $$props.date);
    		if ('content' in $$props) $$invalidate(2, content = $$props.content);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, date, content];
    }

    class BlogPost extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { title: 0, date: 1, content: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BlogPost",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*title*/ ctx[0] === undefined && !('title' in props)) {
    			console.warn("<BlogPost> was created without expected prop 'title'");
    		}

    		if (/*date*/ ctx[1] === undefined && !('date' in props)) {
    			console.warn("<BlogPost> was created without expected prop 'date'");
    		}

    		if (/*content*/ ctx[2] === undefined && !('content' in props)) {
    			console.warn("<BlogPost> was created without expected prop 'content'");
    		}
    	}

    	get title() {
    		throw new Error("<BlogPost>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<BlogPost>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get date() {
    		throw new Error("<BlogPost>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set date(value) {
    		throw new Error("<BlogPost>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get content() {
    		throw new Error("<BlogPost>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set content(value) {
    		throw new Error("<BlogPost>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\TopButton.svelte generated by Svelte v3.46.4 */

    const file$1 = "src\\TopButton.svelte";

    function create_fragment$1(ctx) {
    	let div;
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*text*/ ctx[0]);
    			attr_dev(div, "id", "gas");
    			attr_dev(div, "class", "svelte-93ldww");
    			add_location(div, file$1, 31, 0, 883);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", GoTop, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*text*/ 1) set_data_dev(t, /*text*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function GoTop() {
    	window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TopButton', slots, []);
    	let { text } = $$props;
    	let status = "true";

    	let Scroll = function () {
    		let y = window.scrollY;

    		if (y > 0 && status == "true") {
    			document.getElementById("gas").style.display = "flex";
    			document.getElementById("gas").animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500, fill: "forwards" });
    			document.getElementById("gas").style.cursor = "pointer";
    			status = "false";
    		} else if (y == 0 && status == "false") {
    			document.getElementById("gas").style.display = "flex";
    			document.getElementById("gas").animate([{ opacity: 1 }, { opacity: 0 }], { duration: 500, fill: "forwards" });
    			document.getElementById("gas").style.cursor = "default";
    			status = "true";
    		}
    	};

    	window.addEventListener("scroll", Scroll);
    	const writable_props = ['text'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TopButton> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    	};

    	$$self.$capture_state = () => ({ text, status, GoTop, Scroll });

    	$$self.$inject_state = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    		if ('status' in $$props) status = $$props.status;
    		if ('Scroll' in $$props) Scroll = $$props.Scroll;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [text];
    }

    class TopButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { text: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TopButton",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*text*/ ctx[0] === undefined && !('text' in props)) {
    			console.warn("<TopButton> was created without expected prop 'text'");
    		}
    	}

    	get text() {
    		throw new Error("<TopButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<TopButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.46.4 */

    const { console: console_1 } = globals;
    const file = "src\\App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[0] = list[i];
    	return child_ctx;
    }

    // (21:3) <Container flexDirection="column">
    function create_default_slot_5(ctx) {
    	let navigation0;
    	let t0;
    	let navigation1;
    	let t1;
    	let navigation2;
    	let t2;
    	let navigation3;
    	let t3;
    	let navigation4;
    	let current;

    	navigation0 = new Navigation({
    			props: {
    				name: "Stari Sajt",
    				link: "https://hominglesi.github.io/p/old/index.html"
    			},
    			$$inline: true
    		});

    	navigation1 = new Navigation({
    			props: {
    				name: "Web Dizajn",
    				link: "https://hominglesi.github.io/p/web_dizajn/index.html"
    			},
    			$$inline: true
    		});

    	navigation2 = new Navigation({
    			props: {
    				name: "Hardver",
    				link: "https://hominglesi.github.io/p/hardver/index.html"
    			},
    			$$inline: true
    		});

    	navigation3 = new Navigation({
    			props: {
    				name: "FastJam",
    				link: "https://hominglesi.github.io/p/jam/index.html"
    			},
    			$$inline: true
    		});

    	navigation4 = new Navigation({
    			props: {
    				name: "Forest Shelter",
    				link: "https://hominglesi.github.io/p/forest_shelter/index.html"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(navigation0.$$.fragment);
    			t0 = space();
    			create_component(navigation1.$$.fragment);
    			t1 = space();
    			create_component(navigation2.$$.fragment);
    			t2 = space();
    			create_component(navigation3.$$.fragment);
    			t3 = space();
    			create_component(navigation4.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(navigation0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(navigation1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(navigation2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(navigation3, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(navigation4, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navigation0.$$.fragment, local);
    			transition_in(navigation1.$$.fragment, local);
    			transition_in(navigation2.$$.fragment, local);
    			transition_in(navigation3.$$.fragment, local);
    			transition_in(navigation4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navigation0.$$.fragment, local);
    			transition_out(navigation1.$$.fragment, local);
    			transition_out(navigation2.$$.fragment, local);
    			transition_out(navigation3.$$.fragment, local);
    			transition_out(navigation4.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navigation0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(navigation1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(navigation2, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(navigation3, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(navigation4, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(21:3) <Container flexDirection=\\\"column\\\">",
    		ctx
    	});

    	return block;
    }

    // (20:2) <Navigation name="Arhivirano" isDropDownList=true>
    function create_default_slot_4(ctx) {
    	let container;
    	let current;

    	container = new Container({
    			props: {
    				flexDirection: "column",
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(container.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(container, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const container_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				container_changes.$$scope = { dirty, ctx };
    			}

    			container.$set(container_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(container.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(container.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(container, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(20:2) <Navigation name=\\\"Arhivirano\\\" isDropDownList=true>",
    		ctx
    	});

    	return block;
    }

    // (15:1) <Container width="1200px" height="40px" margin="0 auto" backgroundColor="rgba(0,0,0,0.5)">
    function create_default_slot_3(ctx) {
    	let navigation0;
    	let t0;
    	let navigation1;
    	let t1;
    	let navigation2;
    	let t2;
    	let navigation3;
    	let t3;
    	let navigation4;
    	let current;

    	navigation0 = new Navigation({
    			props: {
    				name: "Blog",
    				link: "https://hominglesi.github.io/"
    			},
    			$$inline: true
    		});

    	navigation1 = new Navigation({
    			props: {
    				name: "Peh",
    				link: "https://hominglesi.github.io/p/peh/index.html"
    			},
    			$$inline: true
    		});

    	navigation2 = new Navigation({
    			props: {
    				name: "Tesic site",
    				link: "https://hominglesi.github.io/p/tesic/index.html"
    			},
    			$$inline: true
    		});

    	navigation3 = new Navigation({
    			props: {
    				name: "Zvuci",
    				link: "https://hominglesi.github.io/p/zvuci/index.html"
    			},
    			$$inline: true
    		});

    	navigation4 = new Navigation({
    			props: {
    				name: "Arhivirano",
    				isDropDownList: "true",
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(navigation0.$$.fragment);
    			t0 = space();
    			create_component(navigation1.$$.fragment);
    			t1 = space();
    			create_component(navigation2.$$.fragment);
    			t2 = space();
    			create_component(navigation3.$$.fragment);
    			t3 = space();
    			create_component(navigation4.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(navigation0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(navigation1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(navigation2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(navigation3, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(navigation4, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const navigation4_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				navigation4_changes.$$scope = { dirty, ctx };
    			}

    			navigation4.$set(navigation4_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navigation0.$$.fragment, local);
    			transition_in(navigation1.$$.fragment, local);
    			transition_in(navigation2.$$.fragment, local);
    			transition_in(navigation3.$$.fragment, local);
    			transition_in(navigation4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navigation0.$$.fragment, local);
    			transition_out(navigation1.$$.fragment, local);
    			transition_out(navigation2.$$.fragment, local);
    			transition_out(navigation3.$$.fragment, local);
    			transition_out(navigation4.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navigation0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(navigation1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(navigation2, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(navigation3, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(navigation4, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(15:1) <Container width=\\\"1200px\\\" height=\\\"40px\\\" margin=\\\"0 auto\\\" backgroundColor=\\\"rgba(0,0,0,0.5)\\\">",
    		ctx
    	});

    	return block;
    }

    // (35:3) {#each blogPosts as post}
    function create_each_block(ctx) {
    	let blogpost;
    	let current;
    	const blogpost_spread_levels = [/*post*/ ctx[0]];
    	let blogpost_props = {};

    	for (let i = 0; i < blogpost_spread_levels.length; i += 1) {
    		blogpost_props = assign(blogpost_props, blogpost_spread_levels[i]);
    	}

    	blogpost = new BlogPost({ props: blogpost_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(blogpost.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(blogpost, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const blogpost_changes = (dirty & /*blogPosts*/ 0)
    			? get_spread_update(blogpost_spread_levels, [get_spread_object(/*post*/ ctx[0])])
    			: {};

    			blogpost.$set(blogpost_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(blogpost.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(blogpost.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(blogpost, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(35:3) {#each blogPosts as post}",
    		ctx
    	});

    	return block;
    }

    // (33:2) <Container flexDirection="column" flexGrow="1" padding="20px">
    function create_default_slot_2(ctx) {
    	let title;
    	let t;
    	let each_1_anchor;
    	let current;

    	title = new Title({
    			props: {
    				text: "Blog",
    				fontFamily: "Quantico",
    				fontSize: "42px",
    				margin: "0 0 16px 0"
    			},
    			$$inline: true
    		});

    	let each_value = blogPosts;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			create_component(title.$$.fragment);
    			t = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			mount_component(title, target, anchor);
    			insert_dev(target, t, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*blogPosts*/ 0) {
    				each_value = blogPosts;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(title.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(title.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(title, detaching);
    			if (detaching) detach_dev(t);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(33:2) <Container flexDirection=\\\"column\\\" flexGrow=\\\"1\\\" padding=\\\"20px\\\">",
    		ctx
    	});

    	return block;
    }

    // (39:2) <Container flexDirection="column" width="450px" alignItems="center" gap="8px" padding="50px 0 0 0">
    function create_default_slot_1(ctx) {
    	let sidebutton0;
    	let t0;
    	let sidebutton1;
    	let t1;
    	let sidebutton2;
    	let t2;
    	let sidebutton3;
    	let t3;
    	let sidebutton4;
    	let t4;
    	let sidebutton5;
    	let t5;
    	let sidebutton6;
    	let t6;
    	let sidebutton7;
    	let t7;
    	let sidebutton8;
    	let current;

    	sidebutton0 = new SideButton({
    			props: {
    				text: "Wordle Versus",
    				link: "https://hominglesi.github.io/p/wordle/"
    			},
    			$$inline: true
    		});

    	sidebutton1 = new SideButton({
    			props: {
    				text: "Playlists",
    				link: "https://hominglesi.github.io/p/playlists/index.html"
    			},
    			$$inline: true
    		});

    	sidebutton2 = new SideButton({
    			props: {
    				text: "Suspicious Dictionary",
    				link: "https://hominglesi.github.io/p/dictionary/index.html"
    			},
    			$$inline: true
    		});

    	sidebutton3 = new SideButton({
    			props: {
    				text: "Bubble Clicker",
    				link: "https://hominglesi.github.io/p/osu/index.html"
    			},
    			$$inline: true
    		});

    	sidebutton4 = new SideButton({
    			props: {
    				text: "Pong Man",
    				link: "https://hominglesi.github.io/p/pong/index.html"
    			},
    			$$inline: true
    		});

    	sidebutton5 = new SideButton({
    			props: {
    				text: "Toxic Man",
    				link: "https://hominglesi.github.io/p/toxic/index.html"
    			},
    			$$inline: true
    		});

    	sidebutton6 = new SideButton({
    			props: {
    				text: "List Man",
    				link: "https://hominglesi.github.io/p/list/index.html"
    			},
    			$$inline: true
    		});

    	sidebutton7 = new SideButton({
    			props: {
    				text: "Mine Man",
    				link: "https://hominglesi.github.io/p/mines/index.html"
    			},
    			$$inline: true
    		});

    	sidebutton8 = new SideButton({
    			props: {
    				text: "Kalendar",
    				link: "https://hominglesi.github.io/p/kalendar/index.html"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(sidebutton0.$$.fragment);
    			t0 = space();
    			create_component(sidebutton1.$$.fragment);
    			t1 = space();
    			create_component(sidebutton2.$$.fragment);
    			t2 = space();
    			create_component(sidebutton3.$$.fragment);
    			t3 = space();
    			create_component(sidebutton4.$$.fragment);
    			t4 = space();
    			create_component(sidebutton5.$$.fragment);
    			t5 = space();
    			create_component(sidebutton6.$$.fragment);
    			t6 = space();
    			create_component(sidebutton7.$$.fragment);
    			t7 = space();
    			create_component(sidebutton8.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(sidebutton0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(sidebutton1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(sidebutton2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(sidebutton3, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(sidebutton4, target, anchor);
    			insert_dev(target, t4, anchor);
    			mount_component(sidebutton5, target, anchor);
    			insert_dev(target, t5, anchor);
    			mount_component(sidebutton6, target, anchor);
    			insert_dev(target, t6, anchor);
    			mount_component(sidebutton7, target, anchor);
    			insert_dev(target, t7, anchor);
    			mount_component(sidebutton8, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sidebutton0.$$.fragment, local);
    			transition_in(sidebutton1.$$.fragment, local);
    			transition_in(sidebutton2.$$.fragment, local);
    			transition_in(sidebutton3.$$.fragment, local);
    			transition_in(sidebutton4.$$.fragment, local);
    			transition_in(sidebutton5.$$.fragment, local);
    			transition_in(sidebutton6.$$.fragment, local);
    			transition_in(sidebutton7.$$.fragment, local);
    			transition_in(sidebutton8.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sidebutton0.$$.fragment, local);
    			transition_out(sidebutton1.$$.fragment, local);
    			transition_out(sidebutton2.$$.fragment, local);
    			transition_out(sidebutton3.$$.fragment, local);
    			transition_out(sidebutton4.$$.fragment, local);
    			transition_out(sidebutton5.$$.fragment, local);
    			transition_out(sidebutton6.$$.fragment, local);
    			transition_out(sidebutton7.$$.fragment, local);
    			transition_out(sidebutton8.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sidebutton0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(sidebutton1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(sidebutton2, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(sidebutton3, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(sidebutton4, detaching);
    			if (detaching) detach_dev(t4);
    			destroy_component(sidebutton5, detaching);
    			if (detaching) detach_dev(t5);
    			destroy_component(sidebutton6, detaching);
    			if (detaching) detach_dev(t6);
    			destroy_component(sidebutton7, detaching);
    			if (detaching) detach_dev(t7);
    			destroy_component(sidebutton8, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(39:2) <Container flexDirection=\\\"column\\\" width=\\\"450px\\\" alignItems=\\\"center\\\" gap=\\\"8px\\\" padding=\\\"50px 0 0 0\\\">",
    		ctx
    	});

    	return block;
    }

    // (32:1) <Container width="1200px" margin="0 auto 8px auto" backgroundColor="rgba(0,0,0,0.6)">
    function create_default_slot(ctx) {
    	let container0;
    	let t;
    	let container1;
    	let current;

    	container0 = new Container({
    			props: {
    				flexDirection: "column",
    				flexGrow: "1",
    				padding: "20px",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	container1 = new Container({
    			props: {
    				flexDirection: "column",
    				width: "450px",
    				alignItems: "center",
    				gap: "8px",
    				padding: "50px 0 0 0",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(container0.$$.fragment);
    			t = space();
    			create_component(container1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(container0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(container1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const container0_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				container0_changes.$$scope = { dirty, ctx };
    			}

    			container0.$set(container0_changes);
    			const container1_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				container1_changes.$$scope = { dirty, ctx };
    			}

    			container1.$set(container1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(container0.$$.fragment, local);
    			transition_in(container1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(container0.$$.fragment, local);
    			transition_out(container1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(container0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(container1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(32:1) <Container width=\\\"1200px\\\" margin=\\\"0 auto 8px auto\\\" backgroundColor=\\\"rgba(0,0,0,0.6)\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let title;
    	let t0;
    	let container0;
    	let t1;
    	let container1;
    	let t2;
    	let container2;
    	let t3;
    	let topbutton;
    	let t4;
    	let style;
    	let current;

    	title = new Title({
    			props: {
    				text: "Fast Mans",
    				fontFamily: "Sofia",
    				fontSize: "48px",
    				margin: "32px 0 0 0"
    			},
    			$$inline: true
    		});

    	container0 = new Container({
    			props: {
    				width: "1200px",
    				height: "40px",
    				margin: "0 auto",
    				backgroundColor: "rgba(0,0,0,0.5)",
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	container1 = new Container({
    			props: {
    				width: "1200px",
    				margin: "0 auto",
    				height: "10px"
    			},
    			$$inline: true
    		});

    	container2 = new Container({
    			props: {
    				width: "1200px",
    				margin: "0 auto 8px auto",
    				backgroundColor: "rgba(0,0,0,0.6)",
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	topbutton = new TopButton({ props: { text: "▲" }, $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(title.$$.fragment);
    			t0 = space();
    			create_component(container0.$$.fragment);
    			t1 = space();
    			create_component(container1.$$.fragment);
    			t2 = space();
    			create_component(container2.$$.fragment);
    			t3 = space();
    			create_component(topbutton.$$.fragment);
    			t4 = space();
    			style = element("style");
    			style.textContent = "@font-face {\r\n\t\tfont-family: \"Quantico\";\r\n\t\tsrc: url('build/fonts/Quantico.eot?#iefix') format('embedded-opentype'),\r\n\t\t\turl('build/fonts/Quantico.woff') format('woff'),\r\n\t\t\turl('build/fonts/Quantico.ttf')  format('truetype'),\r\n\t\t\turl('build/fonts/Quantico.svg#svgFontName') format('svg');\r\n\t\tfont-weight: normal;\r\n\t\tfont-style: normal;\r\n\t\t}\r\n\r\n\t\t@font-face {\r\n\t\t\tfont-family: \"Sofia\";\r\n\t\t\tsrc: url('build/fonts/Sofia.eot?#iefix') format('embedded-opentype'),\r\n\t\t\t\turl('build/fonts/Sofia.woff') format('woff'),\r\n\t\t\t\turl('build/fonts/Sofia.ttf')  format('truetype'),\r\n\t\t\t\turl('build/fonts/Sofia.svg#svgFontName') format('svg');\r\n\t\t\tfont-weight: normal;\r\n\t\t\tfont-style: normal;\r\n\t\t}\r\n\t\tbody{\r\n\t\t\tbackground: url(\"build/bg.jpg\") no-repeat center center fixed;;\r\n\t\t}\r\n\t";
    			attr_dev(main, "class", "svelte-1x2bzwb");
    			add_location(main, file, 12, 0, 362);
    			add_location(style, file, 62, 1, 2946);
    			document.title = "Fastmans";
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(title, main, null);
    			append_dev(main, t0);
    			mount_component(container0, main, null);
    			append_dev(main, t1);
    			mount_component(container1, main, null);
    			append_dev(main, t2);
    			mount_component(container2, main, null);
    			append_dev(main, t3);
    			mount_component(topbutton, main, null);
    			insert_dev(target, t4, anchor);
    			append_dev(document.head, style);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const container0_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				container0_changes.$$scope = { dirty, ctx };
    			}

    			container0.$set(container0_changes);
    			const container2_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				container2_changes.$$scope = { dirty, ctx };
    			}

    			container2.$set(container2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(title.$$.fragment, local);
    			transition_in(container0.$$.fragment, local);
    			transition_in(container1.$$.fragment, local);
    			transition_in(container2.$$.fragment, local);
    			transition_in(topbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(title.$$.fragment, local);
    			transition_out(container0.$$.fragment, local);
    			transition_out(container1.$$.fragment, local);
    			transition_out(container2.$$.fragment, local);
    			transition_out(topbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(title);
    			destroy_component(container0);
    			destroy_component(container1);
    			destroy_component(container2);
    			destroy_component(topbutton);
    			if (detaching) detach_dev(t4);
    			detach_dev(style);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	console.log(blogPosts);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Container,
    		Navigation,
    		SideButton,
    		Title,
    		blogPosts,
    		BlogPost,
    		TopButton
    	});

    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
