/**
 * Arefi Terminal
 * Copyright (C) 2025 Arefi
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

// This is the main entry point for the application.
// Its sole purpose is to import the top-level Terminal component.
// The import statement triggers the registration of the <arefi-terminal> custom element.
// Once registered, the browser will automatically instantiate it for any such tag in the HTML.
// The component itself is now responsible for its entire setup and lifecycle.
import { Terminal } from './Components/Terminal.js';
