/*
 * Copyright 2019 WICKLETS LLC
 *
 * This file is part of Wick Engine.
 *
 * Wick Engine is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Wick Engine is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Wick Engine.  If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * The Project GUIElement handles the creation of the canvas and drawing the rest of the GUIElements.
 */
Wick.GUIElement.Project = class extends Wick.GUIElement {
    /**
     * Create a new GUIElement and build the canvas.
     */
    constructor (model) {
        super(model);

        this._canvas = document.createElement('canvas');
        this._ctx = this._canvas.getContext('2d');

        this._canvasContainer = document.createElement('div');
        this._canvasContainer.style.width = "100%";
        this._canvasContainer.style.height = "100%";
        this._canvasContainer.appendChild(this._canvas);

        this._drawnElements = [];

        this._mouse = {x: 0, y: 0};
        this._mouseHoverTargets = [];

        this._scrollX = 0;
        this._scrollY = 0;

        this._popupMenu = null;

        this._onProjectModified = () => {};
        this._onProjectSoftModified = () => {};
    }

    /**
     * The div containing the GUI canvas
     */
    get canvasContainer () {
        return this._canvasContainer;
    }

    set canvasContainer (canvasContainer) {
        this._canvasContainer = canvasContainer;

        if(this._canvas !== this._canvasContainer.children[0]) {
            this._canvasContainer.innerHTML = '';
            this._canvasContainer.appendChild(this._canvas);
        }

        if(!this._mouseEventsAttached) {
            // Mouse events
            // (Only call these with non-touch devices)
            document.addEventListener('mousemove', e => {
                if(e.touches) return;
                this._onMouseMove(e);
            }, false);

            document.addEventListener('mouseup', e => {
                if(e.touches) return;
                this._onMouseUp(e);
            }, false);

            this._canvas.addEventListener('mousedown', e => {
                if(e.touches) return;
                this._onMouseDown(e);
            }, false);

            // Auto-close popup menu if there is a click off-canvas
            document.addEventListener('mousedown', e => {
                if(e.touches) return;
                if(e.target !== this._canvas) {
                    this.closePopupMenu();
                    this.draw();
                }
            }, false);

            // Scroll events
            $(this._canvas).on('mousewheel', this._onMouseWheel.bind(this));

            // Touch events
            this._canvas.addEventListener('touchstart', e => {
                e.buttons = 0;
                e.clientX = e.touches[0].clientX;
                e.clientY = e.touches[0].clientY;
                this._touchStartX = e.clientX;
                this._touchStartY = e.clientY;
                e.movementX = e.touches[0].movementX;
                e.movementY = e.touches[0].movementY;
                this._onMouseMove(e);
                this._onMouseDown(e);
            }, false);
            document.addEventListener('touchmove', e => {
                e.buttons = 1;
                e.clientX = e.touches[0].clientX;
                e.clientY = e.touches[0].clientY;
                e.movementX = e.clientX - this._touchStartX;
                e.movementY = e.clientY - this._touchStartY;
                this._touchStartX = e.clientX;
                this._touchStartY = e.clientY;
                this._onMouseMove(e);
            }, false);
            document.addEventListener('touchend', e => {
                this._onMouseUp(e);
            }, false);

            this._mouseEventsAttached = true;
        }
    }

    /**
     * Resize the canvas so that it fits inside the canvas container, call this when the size of the canvas container changes.
     */
    resize () {
        if(!this._canvasContainer || !this._canvas) return;

        var containerWidth = this.canvasContainer.offsetWidth;
        var containerHeight = this.canvasContainer.offsetHeight;

        // Round off canvas size to avoid blurryness.
        containerWidth = Math.floor(containerWidth) - 2;
        containerHeight = Math.floor(containerHeight) - 1;

        if(this._canvas.width !== containerWidth) {
            this._canvas.width = containerWidth;
        }
        if(this._canvas.height !== containerHeight) {
            this._canvas.height = containerHeight;
        }
    };

    /**
     * Draw this GUIElement and update the mouse state
     */
    draw () {
        var ctx = this.ctx;

        // Make sure canvas is the correct size
        this.resize();

        // Reset drawn objects list
        this._drawnElements = [];

        // Draw the entire GUI
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.model.activeTimeline.guiElement.draw();

        // Draw current popup menu
        if(this._popupMenu) {
            this._popupMenu.draw();
        }

        // Draw tooltips
        this._mouseHoverTargets.forEach(target => {
            if(target.tooltip) {
                target.tooltip.draw(target.localTranslation.x, target.localTranslation.y);
            }
        });
    }

    /**
     * Give a function to call when the timeline modifies the project.
     * @param {function} fn - the function to call
     */
    onProjectModified (fn) {
        this._onProjectModified = fn;
    }

    /**
     * Give a function to call when the timeline "soft modifies" the project (moving the playhead, etc).
     * @param {function} fn - the function to call
     */
    onProjectSoftModified (fn) {
        this._onProjectSoftModified = fn;
    }

    /**
     * Add a GUIElement to the list of objects that were drawn in the last draw call.
     * @param {Wick.GUIElement} elem - the GUIElement to add
     */
    markElementAsDrawn (elem) {
        this._drawnElements.push(elem);
    }

    /**
     * The amount the timeline is scrolled horizontally.
     * @type {number}
     */
    get scrollX () {
        return this._scrollX;
    }

    set scrollX (scrollX) {
        if(scrollX < 0) scrollX = 0;
        if(scrollX > this.horizontalScrollSpace) scrollX = this.horizontalScrollSpace;
        this._scrollX = scrollX;
    }

    /**
     * The amount the timeline is scrolled vertically.
     * @type {number}
     */
    get scrollY () {
        return this._scrollY;
    }

    set scrollY (scrollY) {
        if(scrollY < 0) scrollY = 0;
        if(scrollY > this.verticalScrollSpace) scrollY = this.verticalScrollSpace;
        this._scrollY = scrollY;
    }

    /**
     * The amount of distance the timeline can be scrolled horizontally. Depends on the number of frames.
     * @type {number}
     */
    get horizontalScrollSpace () {
        return (this.model.activeTimeline.length * this.gridCellWidth * 3) + 500;
    }

    /**
     * The amount of distance the timeline can be scrolled vertically. Depends on the number of layers.
     * @type {number}
     */
    get verticalScrollSpace () {
        return this.model.activeTimeline.layers.length * this.gridCellHeight + this.gridCellHeight * 2;
    }

    /**
     * Open a popup menu
     * @param {Wick.GUIElement.PopupMenu} popupMenu - the PopupMenu to open
     */
    openPopupMenu (popupMenu) {
        this._popupMenu = popupMenu;
        this.draw();
    }

    /**
     * Close the current popup menu
     */
    closePopupMenu () {
        this._popupMenu = null;
        this.draw();
    }

    /**
     * String representation of the current frame size, can be "small", "normal", or "large".
     * @type {string}
     */
    get frameSizeMode () {
        if(Wick.GUIElement.GRID_DEFAULT_CELL_WIDTH === Wick.GUIElement.GRID_SMALL_CELL_WIDTH) {
            return 'small';
        } else if(Wick.GUIElement.GRID_DEFAULT_CELL_WIDTH === Wick.GUIElement.GRID_NORMAL_CELL_WIDTH) {
            return 'normal'
        } else if(Wick.GUIElement.GRID_DEFAULT_CELL_WIDTH === Wick.GUIElement.GRID_LARGE_CELL_WIDTH) {
            return 'large';
        }
    }

    /**
     * Drop an asset onto the timeline.
     * @param {string} uuid - The UUID of the desired asset.
     * @param {number} x - The x location of the image after creation in relation to the window.
     * @param {number} y - The y location of the image after creation in relation to the window.
     * @param {boolean} drop - If true, will drop the asset with the uuid onto the hovered frame, modifying the frame.
     */
    dragAssetAtPosition (uuid, x, y, drop) {
        this._onMouseMove({clientX: x, clientY: y, buttons: 0});
        var target = this._getTopMouseTarget();
        if(!target || !(target.model instanceof Wick.Frame)) {
            return;
        }

        var frame = target.model;
        var asset = target.project.model.getAssetByUUID(uuid);
        var oldSound = frame.sound;
        frame.sound = asset;

        if(drop) {
            this.projectWasModified();
        } else {
            this.draw();
            if(oldSound) {
                frame.sound = oldSound;
            } else {
                frame.removeSound();
            }
        }
    }

    /**
     * Auto scrolls the timeline if the playhead is considered off-screen.
     * This is built specifically for moving the playead with hotkeys.
     */
    checkForPlayheadAutoscroll () {
        var scrollWidth = this.canvas.width;
        scrollWidth -= Wick.GUIElement.LAYERS_CONTAINER_WIDTH;
        scrollWidth -= Wick.GUIElement.SCROLLBAR_SIZE;
        scrollWidth -= this.gridCellWidth;

        var scrollMin = this.scrollX;
        var scrollMax = this.scrollX + scrollWidth;

        var playheadPosition = this.model.activeTimeline.playheadPosition;
        var playheadX = (playheadPosition - 1) * this.gridCellWidth;

        if(playheadX < scrollMin) {
            this.scrollX = playheadX;
            this.draw();
        } if (playheadX > scrollMax) {
            this.scrollX = playheadX - scrollWidth;
            this.draw();
        }
    }

    _onMouseMove (e) {
        // Update mouse position
        var rect = this._canvas.getBoundingClientRect();
        this._mouse = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };

        // Optimization: Only update if the mouse is on the canvas (unless something is being dragged)
        var mouseOffCanvas = (
            this._mouse.x < 0 ||
            this._mouse.y < 0 ||
            this._mouse.x > this.canvas.width ||
            this._mouse.y > this.canvas.height);
        if(e.buttons === 0 && !this.canvasClicked && mouseOffCanvas) {
            if(this._mouseHoverTargets.length > 0) {
                this._mouseHoverTargets = [];
                this.draw();
            }
            return;
        }

        // Update mouse targets
        if(e.buttons === 0) {
            // Mouse moved - find new hover targets
            this._mouseHoverTargets = this._drawnElements.filter(elem => {
                return elem.model.project && elem.mouseInBounds(this._mouse);
            });

            // Update cursor
            var top = this._getTopMouseTarget();
            if(top) {
                this.canvas.style.cursor = top.cursor
            } else {
                this.canvas.style.cursor = 'default';
            }
        } else {
            // Mouse is dragging - fire drag events if needed
            if(!this.canvasClicked) {
                // Don't drag if the click didn't originate from the canvas.
            } else if (!this._mouseHasMoved(this._clickXY, {x:e.clientX, y:e.clientY}, 5)) {
                // Don't start dragging things until the mouse has moved a little bit.
            } else {
                this._onMouseDrag(e);
            }
        }

        this.draw();
    }

    _onMouseDown (e) {
        this.closePopupMenu();
        this.canvasClicked = true;
        this._clickXY = {x: e.clientX, y: e.clientY};

        if(this._mouseHoverTargets.length === 0) {
            // Clicked nothing - clear the selection
            this.model.selection.clear();
        } else {
            // Clicked something - run that element's onMouseDown
            this._lastClickedElem = this._getTopMouseTarget();
            this._lastClickedElem.onMouseDown(e);
        }

        this.draw();
    }

    _onMouseUp (e) {
        // Call mouse event functions on the elements interacted with
        var target = this._getTopMouseTarget();
        if(this.canvasClicked && this._isDragging) {
            target && target.onMouseUp(e);
        } else if (this.canvasClicked && this._lastClickedElem === target) {
            target && target.onMouseUp(e);
        }

        this.canvasClicked = false;
        this._isDragging = false;

        this.draw();

        // Call mousemove so that the next mouse targets can be found without having to move the mouse again
        this._onMouseMove(e);

        clearInterval(this.autoscrollInterval);
        this.autoscrollInterval = null;
    }

    _onMouseDrag (e) {
        this._isDragging = true;

        // Call event functons on the elements interacted with
        var target = this._getTopMouseTarget();
        if(target) {
            this.canvas.style.cursor = 'grabbing';
            target.onMouseDrag(e);
            this._doAutoScroll(target);
        }
    }

    _onMouseWheel (e) {
        e.preventDefault();
        var dx = e.deltaX * e.deltaFactor * 0.5;
        var dy = e.deltaY * e.deltaFactor * 0.5;
        this.scrollX += dx;
        this.scrollY -= dy;
        this.draw();
    }

    _getTopMouseTarget () {
        var l = this._mouseHoverTargets.length-1;
        return this._mouseHoverTargets[l];
    }

    _doAutoScroll (target) {
        if(this.autoscrollInterval) return;

        this.autoscrollInterval = setInterval(() => {
            var left = Wick.GUIElement.LAYERS_CONTAINER_WIDTH;
            var right = this.canvas.width - Wick.GUIElement.SCROLLBAR_SIZE;
            var top = Wick.GUIElement.NUMBER_LINE_HEIGHT + Wick.GUIElement.BREADCRUMBS_HEIGHT;
            var bottom = this.canvas.height - Wick.GUIElement.SCROLLBAR_SIZE;

            var distFromLeft = this._mouse.x - left;
            var distFromRight = this._mouse.x - right;
            var distFromTop = this._mouse.y - top;
            var distFromBottom = this._mouse.y - bottom;

            if(target.canAutoScrollX) {
                if(this._mouse.x > right) {
                    this.scrollX += distFromRight * Wick.GUIElement.AUTO_SCROLL_SPEED;
                }
                if(this._mouse.x < left) {
                    this.scrollX += distFromLeft * Wick.GUIElement.AUTO_SCROLL_SPEED;
                }
            }
            if(target.canAutoScrollY) {
                if(this._mouse.y > bottom) {
                    this.scrollY += distFromBottom * Wick.GUIElement.AUTO_SCROLL_SPEED;
                }
                if(this._mouse.y < top) {
                    this.scrollY += distFromTop * Wick.GUIElement.AUTO_SCROLL_SPEED;
                }
            }

            this.draw();
        }, 16);
    }

    _mouseHasMoved (origMouse, currMouse, amount) {
        var d = {
            x: Math.abs(origMouse.x - currMouse.x),
            y: Math.abs(origMouse.y - currMouse.y),
        };
        return d.x > amount || d.y > amount;
    }
}
