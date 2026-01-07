<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrdersTable extends Migration
{
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('user_id');
            $table->string('recipient_name');
            $table->string('recipient_email');
            $table->string('recipient_phone_number', 10);
            $table->string('recipient_address');
            $table->string('recipient_city');
            $table->string('recipient_district');
            $table->string('recipient_ward');
            $table->enum('payment_method', ['cod', 'banking']);
            $table->enum('payment_status', ['pending', 'paid', 'failed']);
            $table->string('datetime_order')->nullable();
            $table->decimal('total_amount', 15, 2);
            $table->decimal('shipping_fee', 15, 2)->default(0);
            $table->enum('status', ['pending', 'confirmed', 'shipping', 'completed', 'cancelled'])->default('pending');
            $table->text('note')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('orders');
    }
}
