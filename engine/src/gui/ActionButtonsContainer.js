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

Wick.GUIElement.ActionButtonsContainer = class extends Wick.GUIElement {
    constructor (model) {
        super(model);

        this.deleteFrameButton = new Wick.GUIElement.ActionButton(this.model, {
            tooltip: 'Delete',
            icon: 'delete_frame',
            clickFn: () => {
                this.model.project.deleteSelectedObjects();
                this.projectWasModified();
            }
        });

        this.insertBlankFrameButton = new Wick.GUIElement.ActionButton(this.model, {
            tooltip: 'Add Frame',
            icon: 'cut_frame',
            clickFn: () => {
                this.model.project.insertBlankFrame();
                this.projectWasModified();
            }
        });

        this.addTweenButton = new Wick.GUIElement.ActionButton(this.model, {
            tooltip: 'Add Tween',
            icon: 'add_tween',
            clickFn: () => {
                this.model.project.createTween();
                this.projectWasModified();
            }
        });

        this.fillGapsModeButton = new Wick.GUIElement.ActionButton(this.model, {
            tooltip: 'Gap Fill Mode',
            icon: 'gap_fill_menu_blank_frames',
            height: 8,
            width: 16,
            clickFn: () => {
                this.project.openPopupMenu(new Wick.GUIElement.PopupMenu(this.model, {
                    x: 0,
                    y: this.canvas.height - Wick.GUIElement.SCROLLBAR_SIZE,
                    mode: 'gapfill',
                }));
            }
        });

        this.gridSizeButton = new Wick.GUIElement.ActionButton(this.model, {
            tooltip: 'Frame Size',
            icon: 'frame_size_menu',
            height: 8,
            width: 16,
            clickFn: () => {
                this.project.openPopupMenu(new Wick.GUIElement.PopupMenu(this.model, {
                    x: 20,
                    y: this.canvas.height - Wick.GUIElement.SCROLLBAR_SIZE,
                    mode: 'framesize'
                }));
            }
        });
    };

    draw () {
        var ctx = this.ctx;

        // Top background
        ctx.fillStyle = Wick.GUIElement.TIMELINE_BACKGROUND_COLOR;
        ctx.beginPath();
        ctx.rect(0, 0, Wick.GUIElement.LAYERS_CONTAINER_WIDTH, Wick.GUIElement.NUMBER_LINE_HEIGHT);
        ctx.fill();

        // Bottom background
        ctx.fillStyle = '#111';
        ctx.beginPath();
        ctx.rect(0, this.canvas.height - Wick.GUIElement.BREADCRUMBS_HEIGHT - Wick.GUIElement.SCROLLBAR_SIZE, Wick.GUIElement.LAYERS_CONTAINER_WIDTH, Wick.GUIElement.SCROLLBAR_SIZE);
        ctx.fill();

        // Gap Fill Mode button
        ctx.save();
        var method = this.project.model.activeTimeline.fillGapsMethod;
        if(method === 'auto_extend') {
            this.fillGapsModeButton.icon = 'gap_fill_menu_extend_frames';
        } else if (method === 'blank_frames') {
            this.fillGapsModeButton.icon = 'gap_fill_menu_blank_frames';
        }
        ctx.translate(18, this.canvas.height - Wick.GUIElement.NUMBER_LINE_HEIGHT - 4);
            this.fillGapsModeButton.draw(true);
        ctx.restore();

        // Frame Size button
        ctx.save();
        ctx.translate(54, this.canvas.height - Wick.GUIElement.NUMBER_LINE_HEIGHT - 4);
            this.gridSizeButton.draw(true);
        ctx.restore();

        var tweenButtonIsActive = this.model.project.canCreateTween;
        var deleteButtonIsActive = this.model.project.selection.getSelectedObjects('Timeline').length > 0;
        ctx.save();

        ctx.save();
        ctx.translate(80, 0);
            // Delete Frame button
            ctx.save();
            ctx.globalAlpha = deleteButtonIsActive ? 1.0 : 0.3;
            ctx.translate(0, 20);
                this.deleteFrameButton.draw(deleteButtonIsActive);
            ctx.restore();

            // Copy Frame Forward button
            ctx.save();
            ctx.globalAlpha = 1.0;
            ctx.translate(30, 20);
                this.insertBlankFrameButton.draw(true);
            ctx.restore();

            // Add Tween button
            ctx.save();
            ctx.globalAlpha = tweenButtonIsActive ? 1.0 : 0.3;
            ctx.translate(60, 20);
                this.addTweenButton.draw(tweenButtonIsActive);
            ctx.restore();
        ctx.restore();

        ctx.restore();
    };
};
