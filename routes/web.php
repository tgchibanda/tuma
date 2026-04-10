<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| All non-API routes return the SPA shell blade view.
| Vue Router handles all client-side routing.
|
*/

Route::get('/{any?}', function () {
    return view('app');
})->where('any', '^(?!api).*');
